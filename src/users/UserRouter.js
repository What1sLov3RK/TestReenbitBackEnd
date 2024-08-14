import { Router } from 'express';
import UserController from './UserController.js';
import { body, validationResult } from 'express-validator';


const UserRouter = Router();

UserRouter.post('/registration',
  [
    body('email').isEmail().withMessage('Incorrect email'),
    body('password').isStrongPassword({
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0
    }).withMessage('Incorrect password'),
    body('firstname').isLength({
      minLength: 3,
    }).withMessage('short firstname'),
    body('lastname').isLength({
      minLength: 3,
    }).withMessage('short lastname'),
    body('nickname').isLength({
      minLength: 3,
    }).withMessage('short nickname')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const result = await UserController.signup(req, res);
    if (!result) {
      return res.status(500).json( {error: "Failed creating user"})
    }
    return res.status(201).json(result);
  });

UserRouter.post('/login',
  [
    body('email').isEmail().withMessage('Incorrect email'),
    body('password').isStrongPassword({
      minLength: 8
    }).withMessage('Incorrect password')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

      const result = await UserController.login(req, res);
      if(!result){
        return res.status(500).json({ error: "Failed login" });
      }
      return res.status(200).json(result);
  }
);

UserRouter.post('/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('no refresh token'),
  ],
  async (req, res ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      const result = await UserController.refreshToken(req, res);
      if(!result){
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.status(200).json(result);
  }
);

export default UserRouter;
