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

export default {
    addFavorite,
}