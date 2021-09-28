import {compare, hash} from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import { UsersRepositories } from '../repositories/UsersRepositories'
import {sign} from 'jsonwebtoken'

interface IAuthenticateRequest{
  email: string;
  password: string;
}

class AuthenticateUserService{
  async execute({email, password}){
    const usersRepositories =  getCustomRepository(UsersRepositories)
    
    //verifica se o e-mail existence
    const user = await usersRepositories.findOne({
      email
    })
    if(!user){
      throw new Error("Email or Password incorrect!")
    }
    //verifica se a senha esta correta
    const passwordMatch  = await compare(password, user.password)
    if(!passwordMatch){
      throw new Error("Email or Password incorrect!")
    }

    //Gera o token
    const token = sign(
      {
        email: user.email,
      }, 
      "0fbc9017799d3dfd8b5fd17a7284442c", 
      {
        subject: user.id,
        expiresIn: "1d",
      }
    )
    return token;

  }
}

export{ AuthenticateUserService }