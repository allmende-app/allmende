import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CommentInput } from "../interfaces";
import { ErrorMessages } from "../messages";
import { Comment, ICommentDocument, Post, User } from "../models";

export const resolvedNestedComments = async (comments: ICommentDocument[]) => {
    const promises = comments.map(
        (comment) =>
            new Promise<ICommentDocument>((resolve) => {
                comment.populate("post").then((_comment) => {
                    _comment.populate("post.sightings").then((c) => {
                        c.populate("author", ["username", "avatarUrl"]).then(
                            (_) => {
                                _.populate("post.author", [
                                    "username",
                                    "avatarUrl",
                                ]).then((end) => resolve(end));
                            },
                        );
                    });
                });
            }),
    );

    return await Promise.all(promises);
};

export const resolveNestedSavedComment = async (comment: ICommentDocument) => {
    const doc = await (
        await (
            await (
                await (await comment.save()).populate("post")
            ).populate("author", ["username", "avatarUrl"])
        ).populate("post.sightings")
    ).populate("post.author", ["username", "avatarUrl"]);
    return doc;
};

export const resolveNextedComment = async (comment: ICommentDocument) => {
    return null;
};

export class CommentsController {
    static async createCommentController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const id = req.params.id;
                const me = await User.findById(req.session.user);
                const post = await Post.findById(id);
                const sendedBody: CommentInput = req.body.comment;

                if (!sendedBody) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        createCommentErr: {
                            body: ErrorMessages.COMMENT_NO_BODY,
                        },
                    });
                }
                if (!id)
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        createCommentErr: {
                            id: ErrorMessages.COMMENT_NO_POST_ID,
                        },
                    });
                if (!post)
                    return res.status(StatusCodes.NOT_FOUND).json({
                        createCommentErr: {
                            post: ErrorMessages.COMMENT_NO_POST,
                        },
                    });
                if (me) {
                    const { body } = sendedBody;
                    const comment = new Comment();
                    comment.construct(body, post["_id"], me["_id"]);
                    const doc = await resolveNestedSavedComment(comment);
                    if (doc) {
                        return res.status(StatusCodes.CREATED).json({
                            comment: doc,
                        });
                    }
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        createCommentErr: {
                            user: ErrorMessages.ME_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    createCommentErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                createCommentErr: {
                    error: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    static async editCommentController(req: Request, res: Response) {
        if (req.session.user) {
            const id: string = req.params.id;
            const body: CommentInput = req.body.comment;
            if (!body)
                return res.status(StatusCodes.BAD_REQUEST).json({
                    editCommentErr: {
                        body: ErrorMessages.COMMENT_NO_BODY,
                    },
                });
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
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        editCommentErr: {
                            unauthorized: er,
                        },
                    });
                }
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    editCommentErr: {
                        id: ErrorMessages.COMMENT_NO_COMMENT_ID,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                editCommentErr: {
                    error: ErrorMessages.INTERNAL_ERROR,
                },
            });
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
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        deleteCommentErr: {
                            unauthorized: err,
                        },
                    });
                }
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    deleteCommentErr: {
                        id: ErrorMessages.COMMENT_NO_COMMENT_ID,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                deleteCommentErr: {
                    error: ErrorMessages.INTERNAL_ERROR,
                },
            });
        }
    }

    static async getCommentsByPostIDController(req: Request, res: Response) {
        if (req.session.user) {
            const id = req.params.id;
            if (id) {
                const comments = await Comment.findCommentsByPostID(id);
                return res.status(StatusCodes.OK).json({
                    comments: comments,
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    getCommentsByPostIDErr: {
                        id: ErrorMessages.POST_NO_ID,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                getCommetnsByPostIDErr: {
                    error: ErrorMessages.INTERNAL_ERROR,
                },
            });
        }
    }

    static async getCommentByIDController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const id = req.params.id;
                if (id) {
                    const comment = await Comment.findById(id);
                    if (comment) {
                        return res.status(StatusCodes.OK).json({
                            comment: comment,
                        });
                    } else {
                        return res.status(StatusCodes.NOT_FOUND).json({
                            getCommentByIDErr: {
                                comment: ErrorMessages.COMMENT_NOT_FOUND(id),
                            },
                        });
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        getCOmmentByIDErr: {
                            id: ErrorMessages.COMMENT_NO_COMMENT_ID,
                        },
                    });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    getCommentByIDErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                getCommentByIdErr: {
                    error: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }
}
