import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import { fetchNasaData } from '../services/nasa';
import { NasaEndpoint, NasaSearchParams } from '../interfaces/utils.interface';
import { orderObject } from '../utils/utils-functions';

const fetchNasaDataByEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { endpoint }, query } = req;
    let params: NasaSearchParams = {
        ...query,
        page: query.page ? +query.page : 1,
        page_size: query.page_size ? +query.page_size : 10,
        media_type: query.media_type ? query.media_type as string : 'image,video'
    };
    const keyOrder = ['q', 'center', 'description', 'description_508', 'keywords', 'location', 'media_type', 'nasa_id', 'page', 'page_size', 'photographer', 'secondary_creator', 'title', 'year_start', 'year_end']
    const orderedObject = orderObject<NasaSearchParams>(params, keyOrder)
    const nasaData = await fetchNasaData(endpoint as NasaEndpoint,orderedObject);
    if(nasaData) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    let message =  successMsg.get('Nasa Data');
    let statusCode = StatusCodes.OK;
    if( nasaData.length === 0 ){
        message = 'No result Found';
        statusCode = StatusCodes.NOT_FOUND
    }
    res.status(statusCode).json({
        status: 'success',
        message: successMsg.get('Nasa Data'),
        data: nasaData
    })
}


export default {
    fetchNasaDataByEndpoint
}