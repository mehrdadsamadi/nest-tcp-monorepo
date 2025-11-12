import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes } from '@nestjs/swagger';
import { UserLoginDto, UserSignupDto } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { ResponseType } from './types/response.type';
import { AuthDecorator } from './decorators/auth.decorator';
import { Request } from 'express';

@Controller('/user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private userClientService: ClientProxy,
    @Inject('TOKEN_SERVICE') private tokenClientService: ClientProxy,
  ) {}

  @Post('signup')
  @ApiConsumes('application/x-www-form-urlencoded')
  async signup(@Body() signupDto: UserSignupDto) {
    const response = await lastValueFrom<ResponseType>(
      this.userClientService.send<ResponseType>('signup', signupDto).pipe(
        catchError((err) => {
          throw err;
        }),
      ),
    );

    if (response?.error)
      throw new HttpException(
        response?.message,
        response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );

    if (response?.data?.userId) {
      const tokenResponse = await lastValueFrom<ResponseType>(
        this.tokenClientService.send<ResponseType>('create_user_token', {
          userId: response?.data?.userId,
        }),
      );

      if (tokenResponse?.data?.token) {
        return {
          token: tokenResponse?.data?.token,
        };
      }
    }

    throw new InternalServerErrorException('Something went wrong');
  }

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
  async login(@Body() loginDto: UserLoginDto) {
    const response = await lastValueFrom<ResponseType>(
      this.userClientService.send<ResponseType>('login', loginDto).pipe(
        catchError((err) => {
          throw err;
        }),
      ),
    );

    if (response?.error)
      throw new HttpException(
        response?.message,
        response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );

    if (response?.data?.userId) {
      const tokenResponse = await lastValueFrom<ResponseType>(
        this.tokenClientService.send<ResponseType>('create_user_token', {
          userId: response?.data?.userId,
        }),
      );

      if (tokenResponse?.data?.token) {
        return {
          token: tokenResponse?.data?.token,
        };
      }
    }

    throw new InternalServerErrorException('Something went wrong');
  }

  @Get('check-login')
  @AuthDecorator()
  checkLogin(@Req() req: Request) {
    return req?.user;
  }

  @Get('logout')
  @AuthDecorator()
  async logout(@Req() req: Request) {
    const { _id } = req?.user!;

    const response = await lastValueFrom<ResponseType>(
      this.tokenClientService.send<ResponseType>('delete_user_token', {
        userId: _id,
      }),
    );

    if (response?.error)
      throw new HttpException(
        response?.message,
        response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      message: response?.message,
    };
  }
}
