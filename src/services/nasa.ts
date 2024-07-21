import axios from "axios";
import { ICacheUtilies, NasaEndpoint, NasaSearchParams } from "../interfaces/utils.interface";
import redisClient from "../config/redis.config";
import util from 'util';

const fetchNasaData = async (endpoint: NasaEndpoint, params: NasaSearchParams = {}, cacheUtilies: ICacheUtilies) => {
    try {
        let baseUrl = process.env.NASA_URL;
        let axiosConfig = { params }
        switch (endpoint) {
            case 'asset':
            case 'metadata':
            case 'captions':
                if (!params.nasa_id) throw new Error(`'nasa_id' is required for ${endpoint} endpoint`);
                    baseUrl += `/${endpoint}/${params.nasa_id}`;
                    delete axiosConfig.params  
                break;
            case 'search':
                baseUrl += `/${endpoint}`;
                break;
            default:
                throw new Error('Invalid endpoint')
        }
        redisClient.hget = util.promisify(redisClient.hget)
        let nasaCollection;
        const key = JSON.stringify({
            key:cacheUtilies.key,
            source: cacheUtilies.source
        })

        const cachedData = await redisClient.hget(JSON.stringify(cacheUtilies.hashKey),key);

        if(cachedData){
            nasaCollection = cachedData
            return JSON.parse(nasaCollection)
        }
        nasaCollection = await axios.get(`${baseUrl}`, axiosConfig);
        redisClient.hset(JSON.stringify(cacheUtilies.hashKey), key, JSON.stringify(nasaCollection.data),'EX',+process.env.REDIS_CACHE_EXP_TIME);

        const nasaData = nasaCollection.data
        return nasaData
    } catch (error: any) {
        console.error('Error fetching data from NASA API:', error);
        throw {
            message: error?.response?.data?.reason ? `Axios Failed: ${error?.response?.data?.reason}` : error.message,
            statusCode: error.response?.status || 400
        };
    }
}

export { 
    fetchNasaData
}