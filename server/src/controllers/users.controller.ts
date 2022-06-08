import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginInput, RegisterInput, ProfileEditInput } from "../interfaces";
import { User } from "../models";
import { ObjectId } from "mongoose";
import EmailValidator from "email-validator";
import { compressImage } from "../utils";
import { passwordStrength, Result } from "check-password-strength";
import { ErrorMessages, SuccessMessages } from "../messages";

declare module "express-session" {
    interface SessionData {
        user: ObjectId;
    }
}

function passwordCheck(
    password: string,
    confirmPassword: string,
    res: Response,
) {
    const strength: Result<string> = passwordStrength(password);

    switch (strength.id) {
        case 0:
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    signUpErr: {
                        password: ErrorMessages.PW_TOO_WEAK,
                    }
                });
        case 1:
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    signUpErr: {
                        password: ErrorMessages.PW_WEAK,
                    },
                });
        case 2:
            break;
        case 3:
            break;
    }
    if (password !== confirmPassword) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                signUpErr: {
                    repeatPassword: ErrorMessages.INCORRECT_PASSWORD,
                },
            });
    }
}

export class UsersController {
    static async registerController(req: Request, res: Response) {
        if (req.body.user) {
            const input: RegisterInput = req.body.user;

            if (!EmailValidator.validate(input.email)) {
                // Logger.warn(`${input.email} is not valid`);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({
                        signUpErr: {
                            email: ErrorMessages.INVALID_EMAIL,
                        }
                    });
            }

            const existingUser = await User.findByEmail(input.email);
            if (existingUser) {
                // Logger.info(`Email address already exists: ${existingUser.email}`);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({
                        signUpErr: {
                            email: ErrorMessages.EMAIL_EXIST,
                        },
                    });
            }
            const existingUsername = await User.findByUsername(input.username);
            if (existingUsername) {
                // Logger.info(`Username already exists: ${input.username}`);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({
                        signUpErr: {
                            username: ErrorMessages.USERNAME_EXIST,
                        },
                    });
            }

            const r = passwordCheck(input.password, input.confirmPassword, res);
            if (r) return r;

            try {
                const user = new User();
                await user.construct(input);

                const doc = await user.save({
                    validateBeforeSave: true,
                    timestamps: true,
                });
                req.session.user = doc["_id"];
                req.session.save();

                await doc.hideSensibleData();
                return res.status(StatusCodes.OK).json({ user: doc });
            } catch (e) {
                // Logger.error(e);
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    signUpErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        }
    }

    static async loginController(req: Request, res: Response) {
        if (req.body.user) {
            const input: LoginInput = req.body.user;
            try {
                const userEmail = await User.findByEmail(input.email);
                const userName = await User.findByUsername(input.username);
                if (!userEmail) {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({
                            loginErr: {
                                email: ErrorMessages.EMAIL_NOT_FOUND,
                            },
                        });
                }
                if (!userName) {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({
                            loginErr: {
                                username: ErrorMessages.USERNAME_NOT_FOUND,
                            },
                        });
                }

                const user = userEmail || userName;

                const match = await user.checkPassword(input.password);
                if (!match) {
                    // Logger.warn("Password is incorrect");
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({
                            loginErr: {
                                password: ErrorMessages.INCORRECT_PASSWORD,
                            },
                        });
                }
                req.session.user = user["_id"];

                await user.hideSensibleData();
                return res.status(StatusCodes.ACCEPTED).json({ user: user });
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    loginErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                loginErr: {
                    error: ErrorMessages.LOGIN_MISSING,
                },
            });
        }
    }

    static async logoutController(req: Request, res: Response) {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) {
                    // Logger.error(err);
                    console.error(err);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({
                            logoutErr: {
                                error: ErrorMessages.DESTROY_COOKIE_ERROR,
                            },
                        });
                }
                return res.status(StatusCodes.OK).json({
                    data: SuccessMessages.LOGOUT,
                });
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                logoutErr: {
                    error: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    static async getOwnProfileController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const user = await User.findById(req.session.user);
                if (user) {
                    user.password = undefined;
                    user.confirmed = undefined;
                    return res.status(StatusCodes.OK).json({
                        user: user,
                    });
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        ownProfileErr: {
                            profile: ErrorMessages.ME_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    ownProfileErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    ownProfileErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    },
                });
        }
    }

    static async getProfileByUsernameController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const username = req.params.username;
                const user = await User.findByUsername(username);
                if (user) {
                    user.password = undefined;
                    user.email = undefined;
                    user.confirmed = undefined;
                    return res.status(StatusCodes.OK).json({
                        user: user,
                    });
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        profileErr: {
                            profile: ErrorMessages.USER_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    profileErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    profileErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    }
                });
        }
    }

    static async followUserController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const username = req.params.username;
                const user = await User.findByUsername(username);
                const me = await User.findById(req.session.user);
                if (user && me) {
                    await me.addUserToFollowing(user);
                    await user.addUserToFollowers(me);
                    const doc = await me.save();
                    await user.save();
                    doc.password = undefined;
                    doc.confirmed = undefined;
                    return res.status(StatusCodes.OK).json({
                        user: doc,
                    });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({
                            followErr: {
                                follow: ErrorMessages.USER_NOT_FOUND,
                            },
                        });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    followErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    followErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    },
                });
        }
    }

    static async unfollowUserController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const username = req.params.username;
                const user = await User.findByUsername(username);
                const me = await User.findById(req.session.user);
                if (user && me) {
                    await me.removeUserFromFollowing(user);
                    await user.removeUserFromFollowers(me);
                    const doc = await me.save();
                    await user.save();
                    doc.password = undefined;
                    doc.confirmed = undefined;
                    return res.status(StatusCodes.OK).json({
                        user: doc,
                    });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND).json({
                            unfollowErr: {
                                unfollow: ErrorMessages.USER_NOT_FOUND,
                            },
                        });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    unfollowErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    unfollowErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    }
                });
        }
    }

    static async removeFollowedUserController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const username = req.params.username;
                const user = await User.findByUsername(username);
                const me = await User.findById(req.session.user);
                if (user && me) {
                    await me.removeUserFromFollowers(user);
                    await user.removeUserFromFollowing(me);
                    const doc = await me.save();
                    await user.save();
                    doc.password = undefined;
                    doc.confirmed = undefined;
                    return res.status(StatusCodes.OK).json({
                        user: doc,
                    });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({
                            removeFollowerErr: {
                                remove: ErrorMessages.USER_NOT_FOUND,
                            },
                        });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({
                        removeFollowerErr: {
                            error: ErrorMessages.INTERNAL_ERROR,
                        }
                    });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    removeFollowerErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    },
                });
        }
    }

    static async uploadAvatar(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const file = req.file;
                if (!file) {
                    return res.status(StatusCodes.BAD_REQUEST)
                        .json({
                            uploadAvatarErr: {
                                avatar: ErrorMessages.AVATAR_MISSING_FILE,
                            },
                        });
                }

                const doc = await User.findById(req.session.user);
                if (doc && file) {
                    compressImage(file);
                    doc.avatarUrl = file.filename;

                    await doc.save();

                    doc.password = undefined;
                    doc.confirmed = undefined;
                    return res.status(StatusCodes.OK).json({
                        user: doc,
                    });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    uploadAvatarErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    uploadAvatarErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    },
                });
        }
    }

    static async deleteProfile(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const user = await User.findById(req.session.user);
                if (user) {
                    await user.remove();
                    res.status(StatusCodes.OK).json({
                        data: SuccessMessages.PROFILE_DELETED,
                    });

                    // TODO: remove all entries which are related to this user
                    // TODO: remove the follower/following from every user ...
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        deleteProfileErr: {
                            profile: ErrorMessages.ME_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    deleteProfileErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    deleteProfileErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    },
                });
        }
    }

    static async editProfileController(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const user = await User.findById(req.session.user);
                const input: ProfileEditInput = req.body.user;
                if (user) {
                    if (input.username) {
                        const anotherUser = await User.findByUsername(
                            input.username,
                        );
                        if (anotherUser) {
                            return res
                                .status(StatusCodes.BAD_REQUEST)
                                .json({
                                    editProfileErr: {
                                        username: ErrorMessages.USERNAME_EXIST,
                                    },
                                });
                        }
                        user.username = input.username;
                        await user.save();
                    }
                    if (input.bio) {
                        user.bio = input.bio;
                        await user.save();
                    }
                    if (input.oldPassword) {
                        if (!input.newPassword || !input.confirmNewPassword) {
                            return res
                                .status(StatusCodes.BAD_REQUEST)
                                .json({
                                    editProfileErr: {
                                        password: ErrorMessages.NO_NEW_PASSWORD,
                                    }
                                });
                        }
                        if (input.newPassword && input.confirmNewPassword) {
                            if (await user.checkPassword(input.oldPassword)) {
                                const r = passwordCheck(
                                    input.newPassword,
                                    input.confirmNewPassword,
                                    res,
                                );
                                if (r) return r;
                                await user.save();
                            } else {
                                return res
                                    .status(StatusCodes.BAD_REQUEST)
                                    .json({
                                        profileErr: {
                                            password: ErrorMessages.MISMATCH_PASSWORD,
                                        },
                                    });
                            }
                        } else {
                            return res.status(StatusCodes.BAD_REQUEST)
                                .json({
                                    editProfileErr: {
                                        password: ErrorMessages.INCORRECT_PASSWORD,
                                    },
                                });
                        }
                    }
                    return res
                        .status(StatusCodes.OK)
                        .json({
                            data: SuccessMessages.PROFILE_EDITED,
                        });
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        editProfileErr: {
                            profile: ErrorMessages.ME_NOT_FOUND,
                        },
                    });
                }
            } catch (e) {
                console.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    editProfileErr: {
                        error: ErrorMessages.INTERNAL_ERROR,
                    },
                });
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    editProfileErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    }
                });
        }
    }
}
