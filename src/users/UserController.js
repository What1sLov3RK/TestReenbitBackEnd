import UserService from "./UserService.js";


class UserController {
  static async signup(req, res) {
    try{
      const new_user = req.body
      const {email, password, firstname, lastname} = new_user
      const tokens = await UserService.createUser(email, password, firstname, lastname)
      return tokens
    }catch (e){
      console.log(e)
    }
  }

  static async login(req, res) {
    try{
      const new_user = req.body
      const tokens = await UserService.login(new_user.email, new_user.password)
      return tokens
    }catch (e){
      console.log(e)
    }
  }

    static async refreshToken(req, res) {
    try{
      const {refreshToken} = req.body
      return await UserService.refreshToken(refreshToken)
    }catch (e){
      console.log(e)
    }
  }
}

export default UserController;