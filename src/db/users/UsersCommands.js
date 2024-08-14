import User from '../models/Users.model.js';

class UsersCommands{
    static async createUser(email, password, firstname, lastname, nickname){
        try {
            return await User.create({email, password,  firstname, lastname, nickname});
        } catch (e)
        {
            console.log(e)
        }
    }

    static async findOneById(userId){
        try{
            return await User.findById(userId)
        } catch (e){
            console.log(e)
        }
    }

        static async findOneByEmail(email){
        try{
            return await User.findOne(email)
        } catch (e){
            console.log(e)
        }
    }


    static async updateRefreshToken(userId, refreshToken){
        try{
            const user = await  User.findById(userId)
            user.refresh_token = refreshToken
            user.save()
            return refreshToken
        } catch(e){
            console.log(e)
        }
    }

}

export default UsersCommands