import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req,res){

    const newUserData = req.body
    
    if(newUserData.type === "admin"){

        if(req.user == null){
            res.json ({
                message :"please login as administrator to create admin accounts"

            })
            return 
        }
    }
    if(req.user.type !== "admin"){

        res.json({

            message : "please login as administator to create admin accounts"
        })
        return 
    }
    //console.log(newUserData)
     newUserData.password = bcrypt.hashSync(newUserData.password,10);
     const user = new User(newUserData)

    /*user.save().then(()=>{
        res.json({
            message: "User Creaated"
         })
    }).catch((error)=>{
        res.json({
            message : "User not Created"
      })
    })*/

      user.save()
        .then(() => {
            res.status(201).json({ message: "User created successfully" });
        })
        .catch((error) => {
            res.status(400).json({
                message: "User not created",
                error: error.message
            });
        });
} 

export function loginUser(req,res){

    User.find({email :req.body.email}).then(
        (users)=>{
            if(users.length  == 0){
                res.json({
                    message :"User not Found"
                })

            }else{

                const user = users[0]

                const isPasswordCorrect = bcrypt.compareSync(req.body.password,user.password)

                if(isPasswordCorrect){
                    
                    const token = jwt.sign({
                        email       : user.email,
                        firstName   : user.firstName,
                        lastName    : user.lastName,
                        isBlocked   : user.isBlocked,
                        type        : user.type,
                        profilePicture:user.profilePicture,
                            
                        },process.env.SECRET)
                        
                        res.json({
                            message : "User Logged in ",
                            token :token
                        })

                }else{
                    res.json({
                        message :"User not logged in Wrong password"
                    })
                }
            }
        }
    )
}

/*
export function deleteUser(req,res){
    User.deleteOne({email : req.body.email}).then(()=>{

        res.json({
            message : "User deleteed"
        })
    })
}*/ 