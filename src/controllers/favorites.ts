import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../lib';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';
import { favoriteServices, userServices } from '../services';
import commonService from '../services/common-service';
import { Favorite } from '../DB/models/favorites';
import { IFavorites } from '../interfaces/favorites';
import { IUtilies } from '../interfaces/utils.interface';

const addFavorite = async (req: Request, res: Response, next: NextFunction) => {

    const { 
        description,
        title,
        photographer,
        nasa_id,
        media_type,
        url
    } = req.body;
    
    const newFavorite = await favoriteServices.createFavoriteService(
        {         
            description,
            title,
            photographer,
            nasa_id,
            media_type, 
            url,
            userId: req.user._id
        },
        );
        if(!newFavorite) throw new ApiError(`Failed to add this item ${title} to your favorite`, StatusCodes.BAD_REQUEST)
        if(newFavorite) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.created('Favorite'),
        data : newFavorite
    })
}


const getAllFavorites = async (req: Request, res: Response, next: NextFunction) => {
    const { 
        user,
        query : { page, limit, sort, select }
    } = req
    
    // const myFavorites = await favoriteServices.getFavoritesService({ userId: user._id })
    const myFavorites = await commonService.getModelService<IFavorites>(
        Favorite,
        { userId: user._id },
        { page, limit, sort, select } as IUtilies
    )
    if(!myFavorites) throw new ApiError(`Failed to get your favorites`, StatusCodes.BAD_REQUEST)
    if(myFavorites) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.get('Favorite'),
        data : myFavorites
    })
}




const getFavoriteById = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id }, user } = req;
    const favorite = await favoriteServices.getFavoriteByIdService({ _id: id, userId: user._id });
    if(!favorite) throw new ApiError (errorMsg.NotFound('Favorite', `${id}`), StatusCodes.NOT_FOUND);
    if(favorite) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('Favorite'),
        data: favorite
    })
}


const deleteFavoriteItem = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id }, user } = req;  

    const favorite = await favoriteServices.getFavoriteByIdService({ _id : id, userId: user._id });
    if(!favorite) throw new ApiError (errorMsg.NotFound('Favorite', `${id}`), StatusCodes.NOT_FOUND);

    const deletedFavorite = await favoriteServices.deleteFavoriteService({ _id : id, userId: user._id });
    if(deletedFavorite) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.deleted('Favorite', `${favorite.title}`),
    })
}


export default {
    addFavorite,
    getFavoriteById,
    getAllFavorites,
    deleteFavoriteItem
}