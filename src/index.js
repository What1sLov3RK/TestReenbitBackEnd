import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from'cors'
import UserRouter from "./users/UserRouter.js";
import ChatRouter from "./chats/ChatRouter.js";


dotenv.config()
const DB_URI  = "mongodb+srv://vladvlados54:fuE-ca87LRFv9EF@cluster0.faox8so.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
    origin:'*',
}
))
app.use(express.json())
app.use('/api/users', UserRouter);
app.use('/api/chat', ChatRouter)



async function startApp(){
    try {
        await mongoose.connect(DB_URI)
        await app.listen(PORT, ()=>{ console.log('server is running on ' + PORT) })
    } catch (e) {
        console.log(e)
    }
}

await startApp()