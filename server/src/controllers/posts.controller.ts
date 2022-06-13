import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Post, Sighting } from "../models";
import { PostInput, SightingInfo } from "../interfaces";
import { ObjectId } from "mongoose";
import axios from "axios";
import { compressImage } from "../utils";
import { ErrorMessages } from "../messages";

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
                    const doc = await (
                        await (await post.save()).populate("sightings")
                    ).populate("author", ["username", "avatarUrl"]);

                    return res.status(StatusCodes.CREATED).json({
                        post: doc,
                    });
                }
            } catch (e) {
                console.error(e);
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
                const post = await Post.findById(id)
                    .populate("sightings")
                    .populate("author", ["username", "avatarUrl"]);
                if (post) {
                    return res.status(StatusCodes.OK).json({
                        post: post,
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
                        tag ? (tag as string) : undefined,
                    );
                    const promises = posts.map(
                        (post) =>
                            new Promise((resolve) => {
                                post.populate("sightings").then((p) =>
                                    p
                                        .populate("author", [
                                            "username",
                                            "avatarUrl",
                                        ])
                                        .then((r) => resolve(r)),
                                );
                            }),
                    );

                    const results = await Promise.all(promises);
                    return res.status(StatusCodes.OK).json({
                        posts: results,
                    });
                }
            } catch (e) {
                console.error(e);
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
}
