import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RegisterInput } from "../interfaces";
import { IUser, User } from "../models";
import { Logger } from "../lib";
import EmailValidator from "email-validator";

declare module 'express-session' {
    interface SessionData {
      user: IUser;
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