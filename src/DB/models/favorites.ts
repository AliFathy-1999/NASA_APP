import { Schema, model, InferSchemaType } from 'mongoose';
import { IFavorites } from '../../interfaces/favorites';

const schema = new Schema<IFavorites>({
    nasaImages: [{
        type: String,
        required: true,
    }],
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
