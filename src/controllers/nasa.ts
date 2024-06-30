import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import { fetchNasaData } from '../services/nasa';
import { NasaEndpoint, NasaSearchParams } from '../interfaces/utils.interface';

const fetchNasaDataByEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { endpoint }, query } = req;
    let params: NasaSearchParams = {
        ...query,
        page: query.page ? +query.page : 1,
        page_size: query.page_size ? +query.page_size : 10,
        media_type: query.media_type ? query.media_type as string : 'image,video'
    };
    const nasaData = await fetchNasaData(endpoint as NasaEndpoint,params);
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