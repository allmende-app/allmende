import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CommentInput } from "../interfaces";
import { Comment, Post, User } from "../models";

export class CommentsController {
    static async createCommentController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const id = req.params.id;
                const me = await User.findById(req.session.user);
                const post = await Post.findById(id);
                const sendedBody: CommentInput = req.body.comment;
                if (!id)
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .send("No ID provided");
                if (!post)
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("Post to comment not found");
                if (me) {
                    const { body } = sendedBody;
                    const comment = new Comment();
                    comment.construct(body, post["_id"], me["_id"]);
                    const doc = await comment.save();
                    if (doc) {
                        return res.status(StatusCodes.CREATED).json({
                            comment: doc,
                        });
                    }
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("No user found, already deleted?");
                }
            } catch (e) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async editCommentController(req: Request, res: Response) {
        if (req.session.user) {
            const id: string = req.params.id;
            const body: CommentInput = req.body.comment;
            if (!body)
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("Bad body request" + JSON.stringify(body));
            if (id) {
                try {
                    const doc = await Comment.findCommentByIDAndEdit(
                        id,
                        req.session.user,
                        body,
                    );
                    return res.status(StatusCodes.OK).json({
                        comment: doc,
                    });
                } catch (er) {
                    console.error(er);
                    return res.status(StatusCodes.UNAUTHORIZED).send(er);
                }
            } else {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("No ID provided");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async deleteCommentController(req: Request, res: Response) {
        if (req.session.user) {
            const id = req.params.id;
            if (id) {
                try {
                    const doc = await Comment.findCommentByIDAndDelete(
                        id as string,
                        req.session.user,
                    );
                    return res.status(StatusCodes.OK).json({
                        comment: doc,
                    });
                } catch (err) {
                    console.error(err);
                    return res
                        .status(StatusCodes.UNAUTHORIZED)
                        .send("Unauthorized user");
                }
            } else {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("No ID provided");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async getCommentsByPostIDController(req: Request, res: Response) {
        if (req.session.user) {
            const id = req.params.id;
            if (id) {
                const comments = await Comment.findCommentsByPostID(id);
                if (comments.length > 0) {
                    return res.status(StatusCodes.OK).json({
                        comments: comments,
                    });
                } else {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .send("No comments found");
                }
            } else {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("No ID provided");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie provided");
        }
    }

    static async getCommentByIDController(req: Request, res: Response) {
        if (req.session.user) {
            const id = req.params.id;
            if (id) {
                const comment = await Comment.findById(id);
                if (comment) {
                    return res.status(StatusCodes.OK).json({
                        comment: comment,
                    });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("Comment not found");
                }
            } else {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("No ID provided");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie provided");
        }
    }
}
