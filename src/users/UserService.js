import User from '../db/models/Users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UsersCommands from '../db/users/UsersCommands.js';
import Chat from "../db/models/Chats.model.js";

dotenv.config();


class UserService {

    static async createUser(email, password, firstname, lastname) {
        try {
             const existingUser = await UsersCommands.findOneByEmail({email: email});
             if (existingUser) {
                 throw new Error('User already exists');
             }
            const hashedPassword = await bcrypt.hash(password, 5);
            const user = await UsersCommands.createUser(email, hashedPassword, firstname, lastname );

            const tokens= await this.generateTokens(user.id, email);
            await UsersCommands.updateRefreshToken(user.id, tokens.refresh_token)

            const chat = await Chat.create({ name: "Gimmel", user: user.id });
            user.chats.push(chat._id);
            const chat2 = await Chat.create({ name: "Aizen", user: user.id });
            user.chats.push(chat2._id);
            const chat3 = await Chat.create({ name: "Frieren", user: user.id });
            user.chats.push(chat3._id);
            await user.save()



            return tokens
        } catch (e) {
            console.error('Error creating user:', e);
            throw e;
        }
    }

    static async login(email, password) {
        try {
            const user = await UsersCommands.findOneByEmail({email: email})
            if (!user) {
                throw new Error('User not found');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const tokens = await this.generateTokens(user.id, email);
                await UsersCommands.updateRefreshToken(user.id, tokens.refresh_token)
                return tokens
            } else {
                throw new Error('Invalid password');
            }
        } catch (e) {
            console.error('Error logging in:', e);
            throw e;
        }
    }

    static async generateTokens(userId, email) {
        const payload = { userId, email };
        const secretKey = process.env.JWT_SECRET;

        if (!secretKey) {
            throw new Error('JWT_SECRET is not defined');
        }

        const accessToken = jwt.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: '7d' });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    static async refreshToken(refreshToken) {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
          throw new Error('JWT_SECRET is not defined');
        }

        try {
          const decoded = await new Promise((resolve, reject) => {
            jwt.verify(refreshToken, secretKey, (err, decoded) => {
              if (err) {
                return reject(err);
              }
              resolve(decoded);
            });
          });
          if (!decoded || !decoded.userId || !decoded.email) {
            throw new Error('Invalid token structure');
          }

          const user = await User.findById(decoded.userId);
          if (!user) {
            throw new Error('User not found');
          }


          const newAccessToken = jwt.sign(
            { userId: user._id, email: user.email },
            secretKey,
            { algorithm: 'HS256', expiresIn: '15m' }
          );
          return { access_token: newAccessToken };
        } catch (err) {
          console.error('Token refresh error:', err.message);
          throw err;
        }
    }
}

export default UserService;
