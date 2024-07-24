import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../lib';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';
import { favoriteServices, userServices } from '../services';
import commonService from '../services/common-service';
import { Favorite, favoritesType } from '../DB/models/favorites';
import { IFavorites } from '../interfaces/favorites';
import { cacheOption, IUtilies } from '../interfaces/utils.interface';

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
    if (!newFavorite) throw new ApiError(`Failed to add this item ${title} to your favorite`, StatusCodes.BAD_REQUEST)
    if (newFavorite) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.created('Favorite'),
        data: newFavorite
    })
}


const getAllFavorites = async (req: Request, res: Response, next: NextFunction) => {
    const {
        user,
        query: { page = 1, limit = 5, sort = "-createdAt", select = '' }
    } = req
    const cacheKey = `data:page:${page}:limit:${limit}:sort:${sort}:select:${select}`
    const myFavorites = await commonService.getModelService<favoritesType>(
        Favorite,
        { userId: user._id },
        { page, limit, sort, select } as IUtilies,
        {
            cacheFlag: cacheOption.USE_CACHE,
            hashKey: req.user._id,
            key: cacheKey,
            source: "favorites"
        }
    )
    if (!myFavorites) throw new ApiError(`Failed to get your favorites`, StatusCodes.BAD_REQUEST)
    if (myFavorites) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.get('Favorite'),
        data: myFavorites
    })
}




const getFavoriteById = async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id }, user } = req;
    const favorite = await favoriteServices.getFavoriteByIdService({ _id: id, userId: user._id });
    if (!favorite) throw new ApiError(errorMsg.NotFound('Favorite', `${id}`), StatusCodes.NOT_FOUND);
    if (favorite) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.get('Favorite'),
        data: favorite
    })
}


const deleteFavoriteItem = async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id }, user } = req;

    const favorite = await favoriteServices.getFavoriteByIdService({ _id: id, userId: user._id });
    if (!favorite) throw new ApiError(errorMsg.NotFound('Favorite', `${id}`), StatusCodes.NOT_FOUND);

    const deletedFavorite = await favoriteServices.deleteFavoriteService({ _id: id, userId: user._id });
    if (deletedFavorite) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.deleted('Favorite', `${favorite.title}`),
    })
}

const updateFavorite = async (req: Request, res: Response, next: NextFunction) => {

    const { body: { title, description }, params: { id } } = req;
    console.log('id:', id)
    
    console.log('req.user._id:', String(req.user._id))
    console.log('id :', id )
    const updatedFavorite = await favoriteServices.updateFavoriteService(
        {
            userId: String(req.user._id),
            _id: id
        },
        { title, description },
    );
    if(updatedFavorite) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.updated('Favorite', `${updatedFavorite.id}`),
        data : updatedFavorite
    })
}
export default {
    addFavorite,
    getFavoriteById,
    getAllFavorites,
    deleteFavoriteItem,
    updateFavorite
}