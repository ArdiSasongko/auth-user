import * as mongoose from 'mongoose'
import { model } from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    profile : {
        type : String,
        default : 'image.jpg'
    },
    email_verified : {
        type : Boolean,
        required : true,
        default : false
    },
    email_token_verification : {
        type : String,
        required : true
    },
    email_token_verification_time : {
        type : Date,
        required : true,
        default : new Date()
    },
    reset_password_token : {
        type : String,
        required : false
    },
    resset_password_token_time : {
        type : Date,
        required : false,
    },
    createdAt : {
        type : Date,
        required : true,
        default : new Date()
    },
    updateAt : {
        type : Date,
        required : true,
        default : new Date()
    }
})

export default model('users', userSchema)