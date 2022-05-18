import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginInput, RegisterInput } from "../interfaces";
import { User } from "../models";
import { ObjectId } from "mongoose";
import EmailValidator from "email-validator";
import { compressImage } from "../utils";

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
                await user.construct(input);
    
                const doc = await user.save({validateBeforeSave: true, timestamps: true});
                req.session.user = doc["_id"];
                req.session.save();
    
                await doc.hideSensibleData();
                return res.status(StatusCodes.OK).json({user:doc});
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
            const user = await User.findByEmail(input.email) || await User.findByUsername(input.username);
            if (!user) {
                // Logger.warn("User not found");
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
            const match = await user.checkPassword(input.password);
            if (!match) {
                // Logger.warn("Password is incorrect");
                return res.status(StatusCodes.BAD_REQUEST).send("Password is incorrect");
            }
            req.session.user = user["_id"];
    
            await user.hideSensibleData();
            return res.status(StatusCodes.ACCEPTED).json({user: user});
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send("No body json")
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
                user.confirmed = undefined;
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
            return res.status(StatusCodes.UNAUTHORIZED).send("No session cookie");
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
                await me.removeUserFromFollowing(user);
                await user.removeUserFromFollowers(me);
                const doc = await me.save();
                await user.save();
                doc.password = undefined;
                doc.confirmed = undefined;
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
                await me.removeUserFromFollowers(user);
                await user.removeUserFromFollowing(me);
                const doc = await me.save();
                await user.save();
                doc.password = undefined;
                doc.confirmed = undefined;
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
            return res.status(StatusCodes.UNAUTHORIZED).send("Not registered or logged in");
        }
    }

      // TODO: delete profile

      // TODO: edit profile controller
}