import { FilterQuery } from 'mongoose';
import { Favorite } from '../DB/models/favorites';
import { IFavorites } from '../interfaces/favorites';
import { cacheOption } from '../interfaces/utils.interface';


const getFavoritesService = async (filterBy: FilterQuery<IFavorites>,cacheFlag: cacheOption = cacheOption.NO_CACHE) : Promise<IFavorites> => {
    if(cacheFlag === cacheOption.USE_CACHE) return await Favorite.findOne(filterBy).cache({}).exec()
    return await Favorite.findOne(filterBy)
}; 

const createFavoriteService = async (favoriteData: Partial<IFavorites>) : Promise<IFavorites>=> await Favorite.create(favoriteData);

const updateFavoriteService = async (filterBy: FilterQuery<IFavorites>, updateData: { [key:string] : any}) : Promise<IFavorites> => await Favorite.findOneAndUpdate(filterBy, updateData, {runValidation: true, new : true});

const deleteFavoriteService = async (filterBy: FilterQuery<IFavorites>) : Promise<IFavorites> => await Favorite.findOneAndDelete(filterBy);

const getFavoriteByIdService = async (filterBy: FilterQuery<IFavorites>) : Promise<IFavorites> => await Favorite.findOne(filterBy);


export default{
    getFavoritesService,
    createFavoriteService,
    updateFavoriteService,
    deleteFavoriteService,
    getFavoriteByIdService,
}
