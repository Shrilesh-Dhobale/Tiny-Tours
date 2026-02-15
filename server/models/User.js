import {Schema,model} from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        },
    password: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    }
});

const User = model('User', userSchema);

export default User;