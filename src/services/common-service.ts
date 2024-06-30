import fetchDataUtils from '../utils/fetch-data-utils';
import Ipaginate from '../interfaces/paginate';
import { Document, FilterQuery, Model } from 'mongoose';
import { IUtilies } from '../interfaces/utils.interface';

type ModelType<T extends Document> = Model<T>;

const getModelService = async <T extends Document>(
    Model: ModelType<T>,
    filterBy: FilterQuery<T>,
    utilities: IUtilies
    ): Promise<Ipaginate> => {
        const { page, limit, sort, select } = utilities
        const model = Model.find(filterBy)
        const fetchData = new fetchDataUtils(model, { page, limit, sort, select });
        (await fetchData.sort().paginate()).selection();
        const results = await fetchData.query;
        const data : Ipaginate = {
            page : +fetchData.page,
            limit : +fetchData.limit,
            totalDocs : fetchData.totalDocs,
            totalPages:fetchData.totalPages,            
            data : results as any[]
        }
        return data
};


export default {
    getModelService,
}