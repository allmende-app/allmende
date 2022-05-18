import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Post, Sighting } from "../models";
import { PostInput } from "../interfaces";
import { ObjectId } from "mongoose";

export class PostsController {
    private static createSightings(files: any[]) {
        return new Promise<Promise<ObjectId>[]>((resolve) => {
            const sightingsJob = files.map(
                (f: any) =>
                    new Promise<ObjectId>((resolve) => {
                        const sighting = new Sighting();
                        sighting.imageUrl = f["filename"];
                        sighting.originalName = f["originalname"];
                        sighting.specie = "Bird";
                        sighting.location = "Berlin";

                        sighting.save().then((d) => resolve(d["_id"]));
                    }),
            );
            resolve(sightingsJob);
        });
    }

    static async createPostController(req: Request, res: Response) {
        if (req.session && req.body) {
            try {
                const files: any = req.files;
                const parent = JSON.parse(req.body.post);
                const body: PostInput = parent.post;
                // const filesMeta = parent.filesMeta
                const userId = req.session.user;
                if (userId) {
                    // const sightingsPromises = this.createSightings(files);
                    // const objectIdPromises = await sightingsPromises;
                    // const objectIds = await Promise.all(objectIdPromises);
                    // const sightingsIds = objectIds.length > 0 ? objectIds : [];

                    const post = new Post();
                    await post.construct(body, userId);
                    // post.sightings = sightingsIds;
                    const doc = await post.save();

                    // Logger.info(`Post created by ${userId}, -> ${doc["_id"]}`);
                    return res.status(StatusCodes.CREATED).json({
                        post: doc,
                    });
                }
            } catch (e) {
                console.error(e);
                // Logger.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Not registered or logged in");
        }
    }

    static async getPostByIDController(req: Request, res: Response) {
        if (req.session.user) {
            if (req.params.id) {
                const id: string = req.params.id;
                const post = await Post.findById(id);
                if (post) {
                    return res.status(StatusCodes.OK).json({
                        post: post,
                    });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send(`Post ${id} not found`);
                }
            } else {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("ID for post missing");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Not registered or logged in");
        }
    }

    static async getPostsController(req: Request, res: Response) {
        if (req.session.user) {
            const limit = req.query.limit ? req.query.limit : 20;
            const page = req.query.page ? req.query.page : 0;
            const tag = req.query.tag ? req.query.tag : undefined;

            if (tag || tag === undefined) {
                const posts = await Post.findPosts(
                    Number(limit),
                    Number(page),
                    tag ? (tag as string) : undefined,
                );
                return res.status(StatusCodes.OK).json({
                    posts: posts,
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Not registered or logged in");
        }
    }

    static async editPostByIDController(req: Request, res: Response) {
        if (req.session.user) {
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
                    return res
                        .status(StatusCodes.NOT_ACCEPTABLE)
                        .send(`Post ${postId} does not belong to you`);
                }
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("Not found");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Not registered or logged in");
        }
    }
}
