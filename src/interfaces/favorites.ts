import { Document, ObjectId } from "mongoose";

interface IFavorites extends Document {
    nasaImages: Array< { [key:string]:any }>;
    userId: string | ObjectId;
}

export { IFavorites }