import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Userchat from "./backend/models/userchat.js";
import Chat from "./backend/models/chat.js";
import { clerkMiddleware, requireAuth } from '@clerk/express'




const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err.message);
  }
};

/*app.get("/api/test",(req, res) => {
  res.json({ message: "API test working" });
  const userId=req.auth.userId
  console.log(userId)
  }
);*/

app.post("/api/chats",requireAuth(), async (req, res) => {
   const { userId } = req.auth();
     const {text} = req.body;

    try {
      const newChat = new Chat({
        userId:userId,
        history: [{ role: "user", parts: [{ text }] }],
      });

      const savedChat = await newChat.save();

      const userChats = await Userchat.find({ userId:userId});

      if (!userChats.length) {
        await new Userchat({
          userId:userId,
          chats: [
            {
              _id: savedChat._id,
              title: text.substring(0, 35),
            },
          ],
        }).save();
      } else {
        await Userchat.updateOne(
          { userId:userId},
          {
            $push: {
              chats: {
                _id: savedChat._id,
                title: text.substring(0, 35),
              },
            },  
          }
        );
      res.status(201).send(savedChat._id);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error creating chat");
    }
  });



app.get("/api/userchats",requireAuth(),async(req,res)=>{
const { userId } = req.auth();

  try{
    const userChats= await Userchat.findOne({userId})

   if (!userChats) {
      return res.status(200).send([]); 
    }
    res.status(200).send(userChats.chats)
  }catch(err){
    console.log(err)
    res.status(500).send("Error fetching user chats");
  }
})


app.get("/api/chats/:id",requireAuth(),async(req,res)=>{
const { userId } = req.auth();

  try{
    const chat= await Chat.findOne({_id:req.params.id,userId});

   if (!chat ) {
      return res.status(404).send("Chat not found or unauthorized");
    }
    res.status(200).send(chat)
  }catch(err){
    console.log(err)
    res.status(500).send("Error fetching user chats");
  }
})



app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(401).send("unauthenticated");
});

app.listen(PORT, () => {
  connect()
  console.log("server running on " + PORT);
});


     