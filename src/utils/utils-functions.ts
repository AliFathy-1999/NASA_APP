import * as crypto from 'crypto';
import { IUser, IUserPayload, TOKEN_TYPE } from '../interfaces/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../lib';
import { StatusCodes } from 'http-status-codes';
import { User } from '../DB/models/users';
import errorMsg from './messages/errorMsg';
import { NasaEndpoint, NasaSearchParams } from '../interfaces/utils.interface';
import axios, { AxiosResponse } from 'axios';

const hashText = (text: string) => {
    return crypto.createHash('sha256').update(text).digest('hex').substring(0, 20);
}
const generateToken = (user: IUserPayload, tokenType = TOKEN_TYPE.ACCESS_TOKEN) => {
    const {
        AUTH_ACCESS_TOKEN_SECRET, AUTH_ACCESS_TOKEN_EXPIRY,
        AUTH_REFRESH_TOKEN_SECRET, AUTH_REFRESH_TOKEN_EXPIRY
    } = process.env;

    let secretOrPrivateKey = AUTH_ACCESS_TOKEN_SECRET;
    let options = { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY }

    if (tokenType === 'REFRESH_TOKEN') {
        secretOrPrivateKey = AUTH_REFRESH_TOKEN_SECRET;
        options.expiresIn = AUTH_REFRESH_TOKEN_EXPIRY
    }
    const { userId, email, role, verified } = user
    const token = jwt.sign(
        {
            userId,
            email,
            role,
            verified
        },
        secretOrPrivateKey,
        options
    )
    return token;
}
const verifyToken = async (bearerToken: string): Promise<IUser | ApiError> => {
    bearerToken = bearerToken.split(' ')[1];
    if (!bearerToken) return new ApiError(errorMsg.signInAgain, StatusCodes.UNAUTHORIZED);
    const decoded = jwt.verify(bearerToken, process.env.AUTH_ACCESS_TOKEN_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) return new ApiError(errorMsg.unAuthenticated, StatusCodes.UNAUTHORIZED);

    return user;
};


export {
    generateToken,
    verifyToken,
    hashText
}