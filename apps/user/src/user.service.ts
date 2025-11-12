import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { ILogin, ISignup } from './interface/user.interface';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signup(signupDto: ISignup) {
    let { name, password, email } = signupDto;

    email = email.toLowerCase();

    let user = await this.userModel.findOne({ email });
    if (user) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'User already exists',
        error: true,
      };
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'User account created successfully',
      data: { userId: user._id.toString() },
    };
  }

  async login(loginDto: ILogin) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'User account not found',
        error: true,
      };
    }

    if (!compareSync(password, user.password)) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Username or password is incorrect',
        error: true,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'User account logged in successfully',
      data: { userId: user._id.toString() },
    };
  }

  async getUserById({ userId }: { userId: string }) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
        error: true,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'User found',
      data: { user },
    };
  }
}
