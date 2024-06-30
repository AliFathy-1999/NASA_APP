import { Document, ObjectId } from "mongoose";

interface IFavorites extends Document {
    title: string;
    description: string,
    photographer: string,
    nasa_id: string
    url:string;
    media_type:string,
    userId: string | ObjectId;
}

export { IFavorites }