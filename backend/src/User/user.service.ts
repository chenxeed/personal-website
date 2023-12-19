import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { UserPayload } from './user.payload';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(body: CreateUserInput): Promise<UserPayload> {
    const createdUser = new this.userModel(body);
    const user = await createdUser.save();
    return user;
  }

  async findUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) {
      throw new NotFoundException(`User with email id:${id} not found `);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found `);
    }
    return user;
  }

  async listUser(): Promise<UserPayload[]> {
    const users = await this.userModel.find();
    return users;
  }

  async updateUser(id: string, body: UpdateUserInput): Promise<UserPayload> {
    await this.userModel.updateOne({ _id: id }, body);
    const updatedUser = this.userModel.findById(id);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }
}
