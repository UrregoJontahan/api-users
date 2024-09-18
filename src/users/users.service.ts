import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
    constructor (@InjectModel (User.name) private userModel: Model<User>){}

    async create(createUserDto: CreateUserDto) : Promise <User> {
        const newUser = new this.userModel(createUserDto);
        return newUser.save()
    }

    async getAllUsers (): Promise<User[]> {
        return this.userModel.find().exec();
    }
}
