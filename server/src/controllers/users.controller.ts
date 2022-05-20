import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginInput, RegisterInput, ProfileEditInput } from "../interfaces";
import { User } from "../models";
import { ObjectId } from "mongoose";
import EmailValidator from "email-validator";
import { compressImage } from "../utils";
import { passwordStrength, Result } from 'check-password-strength'

declare module "express-session" {
    interface SessionData {
        user: ObjectId;
    }
}

function passwordCheck(password: string, confirmPassword: string, res: Response) {
    const strength: Result<string> = passwordStrength(password);

    switch (strength.id) {
        case 0: 
            return res.status(StatusCodes.BAD_REQUEST)
                .send("Password is weak. Use lowercases, uppercases, symbols and numbers short and weak");
        case 1: 
            return res.status(StatusCodes.BAD_REQUEST)
                .send("Password is weak. Use lowercases, uppercases, symbols and numbers");
        case 2:
            break;
        case 3:
            break;
    }
    if(password !== confirmPassword){
        return res.status(StatusCodes.BAD_REQUEST)
                .send("Password and confirm password are not the same")
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
                    .send("EmailError: Email address is not valid");
            }

            const existingUser = await User.findByEmail(input.email);
            if (existingUser) {
                // Logger.info(`Email address already exists: ${existingUser.email}`);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("Email address already exists!");
            }
            const existingUsername = await User.findByUsername(input.username);
            if (existingUsername) {
                // Logger.info(`Username already exists: ${input.username}`);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("Username already exists!");
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
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
            }
        }
    }

    static async loginController(req: Request, res: Response) {
        if (req.body.user) {
            const input: LoginInput = req.body.user;
            const user =
                (await User.findByEmail(input.email)) ||
                (await User.findByUsername(input.username));
            const userEmail = await User.findByEmail(input.email);
            const userName = await User.findByUsername(input.username);
            if (!user) {
                if (!userEmail) {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("Email not found");
                }
                if (!userName) {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("Username not found");
                }
            }

            const match = await user.checkPassword(input.password);
            if (!match) {
                // Logger.warn("Password is incorrect");
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("Password is incorrect");
            }
            req.session.user = user["_id"];

            await user.hideSensibleData();
            return res.status(StatusCodes.ACCEPTED).json({ user: user });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send("No body json");
        }
    }

    static async logoutController(req: Request, res: Response) {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) {
                    // Logger.error(err);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .send(err);
                }
                return res.status(StatusCodes.OK).send("logged out");
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send("Not logged in");
        }
    }

    static async getOwnProfileController(req: Request, res: Response) {
        if (req.session.user) {
            const user = await User.findById(req.session.user);
            if (user) {
                user.password = undefined;
                user.confirmed = undefined;
                return res.status(StatusCodes.OK).json({
                    user: user,
                });
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("Not found");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async getProfileByUsernameController(req: Request, res: Response) {
        if (req.session.user) {
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
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async followUserController(req: Request, res: Response) {
        if (req.session.user) {
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
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send("Found Error");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async unfollowUserController(req: Request, res: Response) {
        if (req.session.user) {
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
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send("Found Error");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async removeFollowedUserController(req: Request, res: Response) {
        if (req.session.user) {
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
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send("Found Error");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }

    static async uploadAvatar(req: Request, res: Response) {
        if (req.session.user) {
            const file = req.file;

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
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error");
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Not registered or logged in");
        }
    }

    static async deleteProfile(req: Request, res: Response) {
        if (req.session.user) {
            const user = await User.findById(req.session.user);
            if (user) {
                await user.remove();
                return res.status(StatusCodes.OK).send("deleted");
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("Not found");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Not registered or logged in");
        }
    }

    static async editProfileController(req: Request, res: Response) {
        if (req.session.user) {
            const user = await User.findById(req.session.user);
            const input: ProfileEditInput = req.body.user;
            if (user) {
                if (input.username) {
                    const anotherUser = await User.findByUsername(input.username);
                    if (anotherUser) {
                        return res.status(StatusCodes.BAD_REQUEST)
                            .send("Username already exists");
                    }
                    user.username = input.username;
                    await user.save();
                }
                if (input.bio) {
                    user.bio = input.bio;
                    await user.save();
                }
                if (input.oldPassword) {
                    if (input.newPassword && input.confirmNewPassword) {
                        if (await user.checkPassword(input.oldPassword)) {
                            const r = passwordCheck(input.newPassword, input.confirmNewPassword, res);
                            if (r) return r;
                            await user.save();
                        } else {
                            return res.status(StatusCodes.BAD_REQUEST)
                                .send("Wrong password");
                        }
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST)
                            .send("No new password");
                    }
                }
                return res.status(StatusCodes.OK).send("Profile edit successful");
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("Not found");
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("No session cookie");
        }
    }
}
