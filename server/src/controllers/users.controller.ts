import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginInput, RegisterInput } from "../interfaces";
import { User } from "../models";
import { ObjectId } from "mongoose";
import EmailValidator from "email-validator";
import { randomAvatarURL } from "../utils";

declare module 'express-session' {
    interface SessionData {
      user: ObjectId;
    }
}
export class UsersController {
    static async registerController(req: Request, res: Response) {
        if (req.body.user) {
            const input: RegisterInput = req.body.user;
    
            if (!EmailValidator.validate(input.email)) {
                // Logger.warn(`${input.email} is not valid`);
                return res.status(StatusCodes.BAD_REQUEST).send("EmailError: Email address is not valid");
            }

            const existingUser = await User.findByEmail(input.email);
            if (existingUser) {
                // Logger.info(`Email address already exists: ${existingUser.email}`);
                return res.status(StatusCodes.BAD_REQUEST).send("Email address already exists!");
            }
            const existingUsername = await User.findByUsername(input.username);
            if (existingUsername) {
                // Logger.info(`Username already exists: ${input.username}`);
                return res.status(StatusCodes.BAD_REQUEST).send("Username already exists!");
            }
            if (input.password.length < 8 && input.password !== input.confirmPassword) {
                // Logger.warn(`Length of password is less than 8 and is not the same as confirmation password`);
                return res.status(StatusCodes.BAD_REQUEST).send("Length of password is less than 8 and is not the same as confirmation password");
            }
    
            try {
                
                const user = new User();
                user.username = input.username;
                await user.setPassword(input.password);
                user.email = input.email;
                user.avatarUrl = randomAvatarURL();
                user.confirmed = false;
    
                const doc = await user.save({validateBeforeSave: true, timestamps: true});
                req.session.user = doc["_id"];
                req.session.save();
    
                doc.password = undefined;
                doc.followers = undefined;
                doc.following = undefined;
                doc.confirmed = undefined;
                return res.status(StatusCodes.OK).json({user:doc});
            } catch (e) {
                // Logger.error(e);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
            }
        }
    }

    static async loginController(req: Request, res: Response) {
        if (!req.session) {
            // Logger.warn("Unauthorized user");
            return res.status(StatusCodes.UNAUTHORIZED).send("You are not logged in or registered");
        }
        if (req.body.user) {
            const input: LoginInput = req.body.user;
            const user = await User.findByEmail(input.email);
            if (!user) {
                // Logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
            if (!user.checkPassword(input.password)) {
                // Logger.warn("Password is incorrect");
                return res.status(StatusCodes.BAD_REQUEST).send("Password is incorrect");
            }
            req.session.user = user["_id"];
    
            user.password = undefined;
            user.followers = undefined;
            user.following = undefined;
            return res.status(StatusCodes.ACCEPTED).json({user: user});
        }
    }

    static async logoutController(req: Request, res: Response) {
        if (req.session.user) {
            req.session.destroy(err => {
                if (err) {
                    // Logger.error(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
                }
                return res.status(StatusCodes.OK).send("Session destroyed");
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
                return res.status(StatusCodes.OK).json({
                    user: user,
                });
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("Not found");
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send("No session cookie");
        }
    }

    static async getProfileByUsernameController(req: Request, res: Response) {
        if (req.session.user) {
            const username = req.params.username;
            const user = await User.findByUsername(username);
            user.password = undefined;
            user.email = undefined;
    
            return res.status(StatusCodes.OK).json({
                user: user,
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send("No session cookie");
        }
    }

    static async followUserController(req: Request, res: Response) {
        if (req.session.user) {
            const username = req.params.username;
            const user = await User.findByUsername(username);
            const me = await User.findById(req.session.user);
            if (user && me) {
                me.addUserToFollowing(user["_id"]);

                const doc = await me.save();
                doc.password = undefined;
                return res.status(StatusCodes.OK).json({
                    user: doc
                });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Found Error");
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send("No session cookie");
        }
    }

    static async unfollowUserController(req: Request, res: Response) {
        if (req.session.user) {
            const username = req.params.username;
            const user = await User.findByUsername(username);
            const me = await User.findById(req.session.user);
            if (user && me) {
                me.removeUserFromFollowing(user["_id"]);

                const doc = await me.save();
                doc.password = undefined;
                return res.status(StatusCodes.OK).json({
                    user: doc
                });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Found Error");
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send("No session cookie");
        }
    }

    static async removeFollowedUserController(req: Request, res: Response) {
        if (req.session.user) {
            const username = req.params.username;
            const user = await User.findByUsername(username);
            const me = await User.findById(req.session.user);
            if (user && me) {
                me.removeUserFromFollowers(user["_id"]);

                const doc = await me.save();
                doc.password = undefined;
                return res.status(StatusCodes.OK).json({
                    user: doc
                });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Found Error");
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send("No session cookie");
        }
    }

    // TODO: delete profile and edit profile controller
}