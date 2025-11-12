import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schema/token.schema';
import { Model } from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,

    private jwtService: JwtService,
  ) {}

  async createUserToken(userId: string) {
    const token = this.jwtService.sign(
      { userId },
      {
        secret: 'mehrdad1379',
        expiresIn: 60 * 60 * 24,
      },
    );

    const userToken = await this.tokenModel.findOne({ userId });
    if (userToken) {
      userToken.token = token;

      await userToken.save();
    } else {
      await this.tokenModel.create({
        userId,
        token,
      });
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Token created successfully',
      data: { token },
    };
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: 'mehrdad1379',
      });

      if (decodedToken?.userId) {
        const existToken = await this.tokenModel.findOne({
          userId: decodedToken?.userId,
        });

        if (!existToken)
          return {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Token not found',
            error: true,
          };

        return {
          status: HttpStatus.OK,
          message: 'Token verified successfully',
          data: { userId: decodedToken?.userId },
        };
      }

      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Token not found',
        error: true,
      };
    } catch (error) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: error?.message ?? 'Token is invalid',
        error: true,
      };
    }
  }

  async deleteUserToken(userId: string) {
    const existToken = await this.tokenModel.findOne({
      userId,
    });

    if (!existToken)
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Token not found',
        error: true,
      };

    await this.tokenModel.deleteOne({ userId });

    return {
      status: HttpStatus.OK,
      message: 'logged out successfully',
      error: false,
    };
  }
}
