import { Schema, model, InferSchemaType } from 'mongoose';
import { IFavorites } from '../../interfaces/favorites';

const schema = new Schema<IFavorites>({
    title: {
        type: String,
        required: [true, 'Please enter title'],
        trim: true
    },
    description:{
        type: String,
        required: [true, 'Please enter description'],
    },
    photographer:{
        type: String,
        required: [true, 'Please enter photographer'],
    },
    nasa_id:{
        type: String,
        required: [true, 'Please enter nasa_id'],
    },
    url:{
        type: String,
        required: [true, 'Please enter url'],
    },
    media_type:{
        type: String,
        required: [true, 'Please enter media_type'],
    },
    userId: {
        type: String,
        required: true,
        trim: true,
        ref: "User"
    },
}, {
    timestamps: true,
    versionKey: false,
})


type favoritesType = InferSchemaType<typeof schema>;
const Favorite = model<IFavorites>('Favorite', schema)

export { Favorite, favoritesType }
