import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../lib';

import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';

import { generateToken, hashText } from '../utils/utils-functions';
import { userServices } from '../services';
import { StatusCodes } from 'http-status-codes';
import { IUserPayload, TOKEN_TYPE } from '../interfaces/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cacheOption } from '../interfaces/utils.interface';


const signIn = async (req:Request, res:Response, next:NextFunction) => {
        const { body : { email, password }} = req
        const user = await userServices.getUserService({email});
        const userPayload: IUserPayload = {
            userId: String(user._id),
            email: user.email,
            role: user.role,
        }
        if (!user) throw new ApiError(errorMsg.IncorrectField('Email'), StatusCodes.UNAUTHORIZED);
        
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw new ApiError(errorMsg.IncorrectField('Password'), StatusCodes.UNAUTHORIZED);        

        infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl} `)
        res
        .status(StatusCodes.OK)
        .cookie('refreshToken', generateToken(userPayload,TOKEN_TYPE.REFRESH_TOKEN), { httpOnly: true, sameSite: 'strict' })
        .json({
            status:'success',
            message : successMsg.signIn(user.userName),
            accessToken: generateToken(userPayload),
            data : user,
        });        
}
const refreshAccessToken = async (req:Request, res:Response, next:NextFunction) => {
    const refreshToken = req.cookies['refreshToken'];    
    if(!refreshToken) throw new ApiError('Access Denied. No refresh token provided.', StatusCodes.UNAUTHORIZED)
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.AUTH_REFRESH_TOKEN_SECRET) as IUserPayload;
    const accessToken = generateToken(decodedRefreshToken) 
    infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl} `)
    res.status(StatusCodes.OK).header('Authorization',`Brearer ${accessToken}`).json({
        accessToken
    })
}
const logout = async (req:Request, res:Response, next:NextFunction) => {
    const refreshToken = req.cookies['refreshToken'];    
    if(!refreshToken) throw new ApiError('Access Denied. No refresh token provided.', StatusCodes.UNAUTHORIZED)
    res.status(StatusCodes.OK)
    .clearCookie('refreshToken').json({
        message: "logout successfully"
    })
}

const register = async (req: Request, res: Response, next: NextFunction) => {  
    
        const { firstName, lastName, userName, email, password, role } = req.body;
        //Send Email
        const token = hashText(email);

        const user = await userServices.createUserService({ firstName, lastName, userName, email, password, role, activaredToken: token });
        
        if(!user) throw new ApiError(errorMsg.customMsg('Error in user registration'), StatusCodes.BAD_REQUEST);

        if(user) infoLogger(`${req.method} | success | ${StatusCodes.CREATED} | ${req.protocol} | ${req.originalUrl}`)
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: successMsg.signUp(user.userName),
            data : user,
})
}

const getProfile =async (req:Request, res:Response, next:NextFunction) => {
    const { _id } = req.user;
    const user = await userServices.getUserService({_id},cacheOption.USE_CACHE);
    if(user) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('User'),
        data: user
    })
}


export default {
    register,
    signIn,
    getProfile,
    refreshAccessToken,
    logout
}