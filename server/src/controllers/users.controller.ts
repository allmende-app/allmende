import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginInput, RegisterInput } from "../interfaces";
import { IUser, User } from "../models";
import { Logger } from "../lib";
import { ObjectId } from "mongoose";
import EmailValidator from "email-validator";

declare module 'express-session' {
    interface SessionData {
      user: ObjectId;
    }
}

export const postLoginUserController = async(req: Request, res: Response) => {
    if (!req.session) {
        Logger.warn("Unauthorized user");
        return res.status(StatusCodes.UNAUTHORIZED).send("You are not logged in or registered");
    }
    if (req.body.user) {
        const input: LoginInput = req.body.user;
        const user = await User.findByEmail(input.email);
        if (!user) {
            Logger.warn("User not found");
            return res.status(StatusCodes.NOT_FOUND).send("User not found");
        }
        if (!user.checkPassword(input.password)) {
            Logger.warn("Password is incorrect");
            return res.status(StatusCodes.BAD_REQUEST).send("Password is incorrect");
        }
        req.session.user = user["_id"];

        user.password = undefined;
        user.followers = undefined;
        user.following = undefined;
        return res.status(StatusCodes.ACCEPTED).json({user: user});
    }
}

export const postRegisterUserController = async(req: Request, res: Response) => {
    if (req.body.user) {
        const input: RegisterInput = req.body.user;

        if (!EmailValidator.validate(input.email)) {
            Logger.warn(`${input.email} is not valid`);
            return res.status(StatusCodes.BAD_REQUEST).send("EmailError: Email address is not valid");
        }

        try {
            const existingUser = await User.findByEmail(input.email);
            if (existingUser) {
                Logger.info(`Email address already exists: ${existingUser.email}`);
                return res.status(StatusCodes.BAD_REQUEST).send("Email address already exists!");
            }
            
            if (input.password.length < 8 && input.password !== input.confirmPassword) {
                Logger.warn(`Length of password is less than 8 and is not the same as confirmation password`);
                return res.status(StatusCodes.BAD_REQUEST).send("Length of password is less than 8 and is not the same as confirmation password");
            }
            const user = new User();
            user.username = input.username;
            await user.setPassword(input.password);
            user.email = input.email;

            const doc = await user.save({validateBeforeSave: true, timestamps: true});
            req.session.user = doc["_id"];
            req.session.save();

            doc.password = undefined;
            doc.followers = undefined;
            doc.following = undefined;
            return res.status(StatusCodes.OK).json({user:doc});
        } catch (e) {
            Logger.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        }
    }
}

export const logoutUserController = (req: Request, res: Response) => {
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) {
                Logger.error(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            return res.status(StatusCodes.OK).send("Session destroyed");
        });
    } else {
        return res.status(StatusCodes.BAD_REQUEST).send("Not logged in");
    }
}

export const getUserController = async(req: Request, res: Response) => {
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

export const getUserByUsernameController = async(req: Request, res: Response) => {
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