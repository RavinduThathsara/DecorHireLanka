//console.log("Hello world");

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const mongoUrl = process.env.MONGO_DB_URL


 mongoose.connect (mongoUrl,{})

 const connection=mongoose.connection;

connection.once("open",()=>{
    console.log("Database Connected");
})

app.use(bodyParser.json())

/*app.get("/",

(req,res)=>{
    console.log(req)
    console.log("This is a get request");
    
    res.json(
        {
            message : "Hello"
        }
    )
}

);

app.post("/",

(req,res)=>{

  
   const newStudent = new Student (req.body)
 
   newStudent.save().then(
    ()=>{
        res.json({
            message: "Student created"
        })
    }
   ).catch(
    (error)=>{
        res.json({
            message : "Error"
        })
    }
   )

}
);*/
app.use(
    (req,res,next)=>{
        const token = req.header("Authorization")?.replace("Bearer","")
        console.log(token);

        if(token !=null){
            jwt.verify(token,process.env.SECRET,(error , decoded)=>{
                
                if(!error){
                   // console.log(decoded)
                    req.user= decoded
                }
            })
        }

        next()
    }
)

app.use("/api/users",userRouter)

app.listen( 
    5000,
    ()=>{
        console.log('Server is running on port 5000');
    }
)