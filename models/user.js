import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    email :{
        type : String,
        required : true,
        unique : true,
    },

    firstName :{
        type :String,
        required:true,
    },
    lastName :{
        type :String,
        required:true,
    },
    password :{
        type :String,
        required:true,
    },
    isBlocked :{
        type :Boolean,
        default:false
    },
    type :{
        type : String,
        default:"customer"
    },
    profilePicture :{
        type :String,
        default : "https://tse2.mm.bing.net/th/id/OIP.AdoJAsiWdwMNG0ZTvUoTUQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"

    }
})

const User = mongoose.model("users",userSchema)

export default User;

// "password": "$2b$10$XQh5R9FzExampleHashedPassword",
// "email": "ravindu37@example.com",