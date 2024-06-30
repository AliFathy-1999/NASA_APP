import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../lib';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';
import { userServices } from '../services';


const updateUser = async (req: Request, res: Response, next: NextFunction) => {

    const { firstName, lastName } = req.body;
    
    const updatedUser = await userServices.updateUserService(
        {_id:req.user._id},
        { firstName, lastName },
        );
        if(updatedUser) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.updated('User', `${req.user._id}`),
        data : updatedUser
    })
}




const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id } } = req;
    
    const user = await userServices.getUserByIdService({ _id: id });
    if(!user) throw new ApiError (errorMsg.NotFound('User', `${id}`), StatusCodes.NOT_FOUND);
    if(user) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('User'),
        data: user
    })
}





export default {
    updateUser,
    getUserById,
}