import axios from "axios";
import { NasaEndpoint, NasaSearchParams } from "../interfaces/utils.interface";

const fetchNasaData = async (endpoint: NasaEndpoint, params: NasaSearchParams = {}) => {
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
                baseUrl += `/${endpoint}`
                break;
            default:
                throw new Error('Invalid endpoint')
        }
        const nasaCollection = await axios.get(`${baseUrl}`, axiosConfig);

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