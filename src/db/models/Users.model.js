import mongoose from "mongoose";

const User = new mongoose.Schema({
    nickname: {type: String },
    email: {type: String, required: true},
    firstname: {type: String },
    lastname: {type: String },
    password: {type: String, required: true},
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    refresh_token: {type: String, required: false, }
})

export default mongoose.model('User', User)