import {Schema, model} from 'mongoose';

const tourSchema = new Schema({
    title: {
        type: String,
        required: true,
    },  
    description: {
        type: String,
        required: true,
    },
    cities: {
        type: [String],
        default: [],
    },
    duration: {
        type: Number,
    },
    photos: {
        type: [
            {
                imgUrl: String,
                title: String,
                description: String,
            },
        ],
        default: [],
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});