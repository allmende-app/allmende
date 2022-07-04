import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
    Comment,
    IPostDocument,
    ISightingDocument,
    Post,
    replicateIPost,
    Sighting,
    User,
} from "../models";
import { PostInput, SightingInfo } from "../interfaces";
import { ObjectId } from "mongoose";
import { compressImage } from "../utils";
import { ErrorMessages } from "../messages";
import fs from "fs";
import path from "path";
import { Logger } from "../lib";
import pLimit from "p-limit";

const concurrent = pLimit(1);

export const userProps = ["username", "avatarUrl"];

const createSightings = (
    files: Express.Multer.File[],
    sightings: SightingInfo[],
) => {
    return new Promise<Promise<ObjectId>[]>((resolve) => {
        const sightingsJob = files.map(
            (f: Express.Multer.File, i: number) =>
                new Promise<ObjectId>((resolve) => {
                    const sighting = new Sighting();
                    const curr = sightings[i];
                    const { species, lat, lng, description } = curr;
                    sighting.imageUrl = f["filename"];
                    sighting.originalName = f["originalname"];

                    if (species) sighting.species = species;
                    if (lat) sighting.lat = lat;
                    if (lng) sighting.lng = lng;
                    if (description) sighting.alt = description;

                    sighting.save().then((d) => resolve(d["_id"]));
                }),
        );
        resolve(sightingsJob);
    });
};

const getSightings = async (sightings: ObjectId[]) => {
    const array = sightings.map((sighting) => {
        return new Promise<(ISightingDocument & { _id: any }) | null>(
            (resolve) => {
                Sighting.findById(sighting).then((res) => resolve(res));
            },
        );
    });
    return array;
};

export const resolveNestedPost = async (post: IPostDocument) => {
    const doc = await (
        await (await post.populate("sightings")).populate("author", userProps)
    ).populate("likes", userProps);
    return doc;
};

export const deleteSightings = async (sightings: ObjectId[]) => {
    const obj = await getSightings(sightings);
    const resolve = await Promise.all(obj);
    resolve.forEach((sighting) => {
        if (sighting) {
            const file = sighting.imageUrl;
            if (file) {
                fs.unlink(path.join(process.cwd(), "uploads", file), (err) => {
                    if (err) {
                        Logger.error(err);
                        throw err;
                    }
                    Logger.info(`File ${file} is deleted.`);
                });
            }
            sighting.delete();
            Logger.info(`Deleted sighting: ${sighting._id}`);
        }
    });
};

export const resolveNestedPosts = async (posts: IPostDocument[]) => {
    const promises = posts.map(
        (post) =>
            new Promise<IPostDocument>((resolve) => {
                post.populate("sightings").then((p) =>
                    p
                        .populate("author", userProps)
                        .then((r) => r.populate("likes", userProps))
                        .then((r) => resolve(r)),
                );
            }),
    );
    return promises;
};

export class PostsController {
    static async createPostController(req: Request, res: Response) {
        if (req.session && req.body) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const files: any = req.files;
                const postBody: PostInput = JSON.parse(req.body.post);
                const { sightings } = postBody;

                const userId = req.session.user;
                if (userId) {
                    files.forEach((file: Express.Multer.File) =>
                        compressImage(file),
                    );
                    const sightingsPromises = createSightings(files, sightings);
                    const objectIdPromises = await sightingsPromises;
                    const objectIds = await Promise.all(objectIdPromises);
                    const sightingsIds = objectIds.length > 0 ? objectIds : [];

                    const post = new Post();
                    await post.construct(postBody, userId);
                    post.sightings = sightingsIds;
                    post.commentsCount = 0;
                    const doc = await (
                        await (await post.save()).populate("sightings")
                    ).populate("author", userProps);

                    return res.status(StatusCodes.CREATED).json({
                        post: doc,
                    });
                }
            } catch (e) {
                Logger.error(e);
                // Logger.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    createPostErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                createPostErr: {
                    post: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    static async getPostByIDController(req: Request, res: Response) {
        if (req.session.user) {
            if (req.params.id) {
                const id: string = req.params.id;
                const post = await Post.findById(id);
                if (post) {
                    const resolved = await resolveNestedPost(post);
                    const doc = await replicateIPost(
                        resolved,
                        req.session.user,
                    );
                    return res.status(StatusCodes.OK).json({
                        post: doc,
                    });
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        getPostByIDErr: {
                            id: ErrorMessages.ID_POST_MISSING(id),
                        },
                    });
                }
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    getPostByIDErr: {
                        id: ErrorMessages.POST_NO_ID,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                getPostByIDErr: {
                    post: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    static async getPostsController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const limit = req.query.limit ? req.query.limit : 20;
                const page = req.query.page ? req.query.page : 0;
                const tag = req.query.tag ? req.query.tag : undefined;

                if (tag || tag === undefined) {
                    const posts = await Post.findPosts(
                        Number(limit),
                        Number(page),
                    );

                    const promises = await resolveNestedPosts(posts);
                    const results = await Promise.all(promises);

                    const me = req.session.user;
                    const queuedDocs = [];
                    for (let i = 0; i < results.length; i += 5) {
                        const temp = results.slice(i, i + 5);
                        const pendings = await Promise.all(temp.map(doc => replicateIPost(doc, me)))
                        queuedDocs.push(...pendings);
                    }
                    return res.status(StatusCodes.OK).json({
                        posts: queuedDocs,
                    });
                }
            } catch (e) {
                Logger.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    getPostsErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                getPostsErr: {
                    error: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    static async getPostsByUsername(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const user = req.params.user;
                const limit = req.query.limit ? req.query.limit : 20;
                const page = req.query.page ? req.query.page : 0;

                if (!user)
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        getPostsByUsernameErr: {
                            params: ErrorMessages.BAD_REQUEST_NO_USERNAME,
                        },
                    });

                const posts = await Post.findPostsOfUser(
                    user,
                    Number(page),
                    Number(limit),
                );
                const promises = await resolveNestedPosts(posts);

                const results = await Promise.all(promises);
                const me = req.session.user;
                const queuedDocs = [];
                for (let i = 0; i < results.length; i += 5) {
                    const temp = results.slice(i, i + 5);
                    const pendings = await Promise.all(temp.map(doc => replicateIPost(doc, me)))
                    queuedDocs.push(...pendings);
                }
                return res.status(StatusCodes.OK).json({
                    posts: queuedDocs,
                });
            } catch (e) {
                Logger.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    getPostsErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                getPostsErr: {
                    error: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    // TODO: wip edit
    static async editPostByIDController(req: Request, res: Response) {
        if (req.session.user) {
            const files: any = req.files;
            const postBody: PostInput = JSON.parse(req.body.post);
            const { sightings } = postBody;

            const parent = JSON.parse(req.body.post);
            const body: PostInput = parent.post;

            const userId = req.session.user;
            const postId = req.params.id;
            const post = await Post.findById(postId);
            if (post) {
                if (post.author === userId) {
                    await post.changeProperties(body);
                    const doc = await post.save();

                    return res.status(StatusCodes.OK).json({
                        post: doc,
                    });
                } else {
                    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
                        editPostByIDErr: {
                            post: ErrorMessages.POST_NOT_TO_USER(postId),
                        },
                    });
                }
            } else {
                return res.status(StatusCodes.NOT_FOUND).json({
                    editPostByIDErr: {
                        post: ErrorMessages.POST_NOT_FOUND,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                editPostByIDErr: {
                    post: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    static async deletePostByID(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const me = await User.findById(req.session.user);
                if (me) {
                    const id = req.params.id;
                    if (id) {
                        const post = await Post.findById(id)
                            .populate("author", ["username", "avatarUrl"])
                            .populate("sightings");
                        if (post) {
                            if (
                                (post.author as any)._id.toString() ===
                                (me._id as any).toString()
                            ) {
                                res.status(StatusCodes.ACCEPTED).json({
                                    post: post,
                                });
                                await Comment.findCommentsByPostIDAndDelete(
                                    (post._id as any).toString(),
                                );
                                const sightings = post.sightings;
                                if (sightings) {
                                    await deleteSightings(sightings);
                                }
                                await post.delete();
                                // deletes attached sightings and images
                            } else {
                                return res
                                    .status(StatusCodes.NOT_ACCEPTABLE)
                                    .json({
                                        removePostByIDErr: {
                                            error: ErrorMessages.POST_NOT_TO_USER(
                                                id,
                                            ),
                                        },
                                    });
                            }
                        } else {
                            return res.status(StatusCodes.NOT_FOUND).json({
                                deletePostByIdErr: {
                                    post: ErrorMessages.ID_POST_MISSING(id),
                                },
                            });
                        }
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            deletePostByIDErr: {
                                id: ErrorMessages.POST_NO_ID,
                            },
                        });
                    }
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        deletePostByIDErr: {
                            error: ErrorMessages.ME_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    removePostByIDErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                deletePostByIDErr: {
                    error: ErrorMessages.INTERNAL_ERROR,
                },
            });
        }
    }

    static async likePostByID(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const me = await User.findById(req.session.user);
                if (me) {
                    const id = req.params.id;
                    const like = req.query.like;
                    if (id) {
                        const post = await Post.findById(id);
                        if (post) {
                            if (like === "true" || like === undefined)
                                await post.addLike(me);
                            else if (like === "false")
                                await post.removeLike(me);
                            const resolvedPost = await resolveNestedPost(post);
                            const copy = await replicateIPost(
                                resolvedPost,
                                req.session.user,
                            );
                            return res.status(StatusCodes.OK).json({
                                post: copy,
                            });
                        } else {
                            return res.status(StatusCodes.NOT_FOUND).json({
                                likePostByIDErr: {
                                    post: ErrorMessages.ID_POST_MISSING(
                                        id as string,
                                    ),
                                },
                            });
                        }
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            likePostByIDErr: {
                                id: ErrorMessages.POST_NO_ID,
                            },
                        });
                    }
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        likePostByIDErr: {
                            error: ErrorMessages.ME_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                Logger.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    likePostByIDErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                likePostByIDErr: {
                    post: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    /**
     * @deprecated
     * @param req
     * @param res
     * @returns
     */
    static async removeLikeByPostID(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const me = await User.findById(req.session.user);
                if (me) {
                    const id = req.params.id;
                    if (id) {
                        const post = await Post.findById(id);
                        if (post) {
                            await post.removeLike(me);
                            const resolvedPost = await resolveNestedPost(post);
                            return res.status(StatusCodes.OK).json({
                                post: resolvedPost,
                            });
                        } else {
                            return res.status(StatusCodes.NOT_FOUND).json({
                                likePostByIDErr: {
                                    post: ErrorMessages.ID_POST_MISSING(
                                        id as string,
                                    ),
                                },
                            });
                        }
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            likePostByIDErr: {
                                id: ErrorMessages.POST_NO_ID,
                            },
                        });
                    }
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        likePostByIDErr: {
                            error: ErrorMessages.ME_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                Logger.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    removeLikeByPostIDErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                removeLikeByPostIDErr: {
                    post: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }
}
