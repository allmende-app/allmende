import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Post, Sighting } from "../models";
import { PostInput } from "../interfaces";
import { ObjectId } from "mongoose";
import axios from "axios";
import { compressImage } from "../utils";

const createSightings = (files: Express.Multer.File[], ids: number[]) => {
    return new Promise<Promise<ObjectId>[]>((resolve) => {
        const sightingsJob = files.map(
            (f: Express.Multer.File, i: number) =>
                new Promise<ObjectId>((resolve) => {
                    axios
                        .get(
                            `https://api.gbif.org/v1/species/${ids[i]}?lang=de`,
                        )
                        .then((r) => r.data)
                        .then((data) => {
                            const sighting = new Sighting();
                            sighting.imageUrl = f["filename"];
                            sighting.originalName = f["originalname"];
                            sighting.species = ids[i];
                            sighting.alt = data.vernacularName;
                            sighting.location = "Berlin";

                            sighting.save().then((d) => resolve(d["_id"]));
                        });
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
                const postBody = JSON.parse(req.body.post);
                const species: number[] = req.body.species;

                const userId = req.session.user;
                if (userId) {
                    files.forEach((file: Express.Multer.File) =>
                        compressImage(file),
                    );
                    const sightingsPromises = createSightings(files, species);
                    const objectIdPromises = await sightingsPromises;
                    const objectIds = await Promise.all(objectIdPromises);
                    const sightingsIds = objectIds.length > 0 ? objectIds : [];

                    const post = new Post();
                    await post.construct(postBody, userId);
                    post.sightings = sightingsIds;
                    const doc = await post.save();

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
                if (posts.length > 0)
                    return res.status(StatusCodes.OK).json({
                        posts: posts,
                    });

                return res.status(StatusCodes.NOT_FOUND).send("No posts found");
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
