import Joi from 'joi';

const addFavorite = {
    body: Joi.object().keys({
        description: Joi.string().required(),
        title: Joi.string().required(),
        photographer: Joi.string().required(),
        nasa_id: Joi.string().required(),
        media_type: Joi.string().valid('image', 'video', 'audio').required(),
        url: Joi.string().required()
    }),
}
const updateFavorite = {
    params: Joi.object().keys({
        id: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).message("Invalid Favorite Id").required()
    }),
    body: Joi.object().keys({
        description: Joi.string().optional(),
        title: Joi.string().optional(),
    })
    .or('description', 'title'),
    
}
export default {
    addFavorite,
    updateFavorite
}