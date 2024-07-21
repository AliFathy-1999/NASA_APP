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
    // const myFavorites = await favoriteServices.getFavoritesService({ userId: user._id })
    const myFavorites = await commonService.getModelService<IFavorites>(
        Favorite,
        { userId: user._id },
        { page, limit, sort, select } as IUtilies,
        {
            cacheFlag: cacheOption.USE_CACHE,
            hashKey: req.user._id,
            key: cacheKey
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

const testInsertFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const favorites = [
        {
            "title": "title 11",
            "description": "description 11",
            "photographer": "photographer 11",
            "nasa_id": "nasa_id 11",
            "url": "url 10",
            "media_type": "image",
            "userId": "650c1a70700870e64b5f3b72",
            "_id": "66891cd8e4a98550a323eae4",
            "createdAt": "2024-07-06T10:30:48.402Z",
            "updatedAt": "2024-07-06T10:30:48.402Z"
        },
        {
            "title": "title 12",
            "description": "description 12",
            "photographer": "photographer 12",
            "nasa_id": "nasa_id 12",
            "url": "url 12",
            "media_type": "image",
            "userId": "650c1a70700870e64b5f3b72",
            "_id": "66891d0ee4a98550a323eae7",
            "createdAt": "2024-07-06T10:31:42.490Z",
            "updatedAt": "2024-07-06T10:31:42.490Z"
        },
        {
            "title": "title 13",
            "description": "description 13",
            "photographer": "photographer 13",
            "nasa_id": "nasa_id 13",
            "url": "url 13",
            "media_type": "image",
            "userId": "650c1a70700870e64b5f3b72",
            "_id": "66891d22e4a98550a323eaea",
            "createdAt": "2024-07-06T10:32:02.061Z",
            "updatedAt": "2024-07-06T10:32:02.061Z"
        }
    ]
    // const addedFavorites = await Favorite.insertMany(favorites, { ordered: false});
    // if(!addedFavorites) throw new ApiError('error while adding favorites', 400)
    res.status(StatusCodes.OK).json({
        data : favorites
    })
}
export default {
    addFavorite,
    getFavoriteById,
    getAllFavorites,
    deleteFavoriteItem,
    testInsertFavorite
}