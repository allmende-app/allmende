import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../lib";
import { IPost, ISightingDocument, Post, Sighting, sightningSchema } from "../models";
import { PostInput } from "../interfaces";
import { ObjectId } from "mongoose"

function createSightings(files: any[]) {
    return new Promise<Promise<ObjectId>[]>((resolve) => {
        const sightingsJob = files.map((f: any) => new Promise<ObjectId>((resolve) => {
            const sighting = new Sighting();
            sighting.imageUrl = f["filename"];
            sighting.originalName = f["originalname"];
            sighting.specie = "Bird";
            sighting.location = "Berlin";

            sighting.save().then(d => resolve(d["_id"]));
        }));
        resolve(sightingsJob);
    });
}

export const postCreatePostController = async(req: Request, res: Response) => {
    if (req.session && req.body) {
        const files: any = req.files;
        const parent = JSON.parse(req.body.post);
        const body: PostInput = parent.post;
        // const filesMeta = parent.filesMeta;
        const userId = req.session.user;

        try {
            if (files && files.length > 0 && userId) {
                const sightingsPromises = createSightings(files);
                const objectIdPromises = await sightingsPromises;
                const objectIds = await Promise.all(objectIdPromises);
                const sightingsIds = objectIds.length > 0 ? objectIds : [];
                
                const post = new Post();
                await post.construct(body, userId);
                post.sightings = sightingsIds;
                const doc = await post.save();

                Logger.info(`Post created by ${userId}, -> ${doc["_id"]}`);
                return res.status(StatusCodes.CREATED).json({
                    post: doc,
                });
            }
        } catch (e) {
            Logger.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        }
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).send("Not registered or logged in");
    }
}

export const getPostByIDController = async(req: Request, res: Response) => {
    if (req.session.user) {
        if (req.params.id) {
            const id: string = req.params.id;
            const post = await Post.findById(id);
            if (post) {
                return res.status(StatusCodes.OK).json({
                    post: post,
                });
            } else {
                return res.status(StatusCodes.NOT_FOUND).send(`Post ${id} not found`);
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send("ID for post missing");
        }
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).send("Not registered or logged in");
    }
}

export const getPostsController = async(req: Request, res: Response) => {
    if (req.session.user) {
        const limit = req.query.limit ? req.query.limit : 20;
        const page = req.query.page ? req.query.page : 0;
        const tag = req.query.tag ? req.query.tag : undefined;

        if (tag || tag === undefined) {
            const posts = await Post.findPosts(Number(limit), Number(page), tag ? tag as string : undefined);
            return res.status(StatusCodes.OK).json({
                posts: posts,   
            });
        }
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).send("Not registered or logged in");
    }
}

// export const putEditPostController = async(req: Request, res: Response) => {
//     if (req.session.user) {
//         const body: PostInput = req.body.post;

//     } else {
//         return res.status(StatusCodes.UNAUTHORIZED).send("Not registered or logged in");
//     }
// }