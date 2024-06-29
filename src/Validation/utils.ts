import Joi from 'joi';


const searchValidator = {
    query: Joi.object().keys({
        q: Joi.string().optional(),
        center: Joi.string().optional(),
        description: Joi.string().optional(),
        description_508: Joi.string().optional(),
        keywords: Joi.string().optional(),
        location: Joi.string().optional(),
        media_type: Joi.string().optional(),
        nasa_id: Joi.string().optional(),
        page: Joi.number().optional(),
        page_size: Joi.number().optional(),
        photographer: Joi.string().optional(),
        secondary_creator: Joi.string().optional(),
        title: Joi.string().optional(),
        year_start: Joi.string().optional(),
        year_end: Joi.string().optional()
    })
    .or('q', 'center', 'description', 'description_508', 'keywords', 'location', 'media_type', 'nasa_id', 'page', 'page_size', 'photographer', 'secondary_creator', 'title', 'year_start', 'year_end'),
    params: Joi.object().keys({
        endpoint: Joi.string().valid('search', 'asset','metadata','captions').required()
    })
}


export default {
    searchValidator
}