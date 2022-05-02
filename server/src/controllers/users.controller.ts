import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginInput, RegisterInput } from "../interfaces";
import { IUser, User } from "../models";
import { Logger } from "../lib";
import EmailValidator from "email-validator";

declare module 'express-session' {
    interface SessionData {
      user: IUser;
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
        user.followee = undefined;
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
            user.name = input.name;
            await user.setPassword(input.password);
            user.email = input.email;

            const doc = await user.save({validateBeforeSave: true, timestamps: true});
            req.session.user = doc["_id"];
            req.session.save();

            doc.password = undefined;
            doc.followee = undefined;
            doc.following = undefined;
            return res.status(StatusCodes.OK).json({user:doc});
        } catch (e) {
            Logger.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        }
    }
}

export const getUserController = (req: Request, res: Response) => {
    if (req.session.user) {
        return res.json({
            a: req.sessionID,
            b: req.session.user,
            c: req.session
        })
    }
}