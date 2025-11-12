import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { ResponseType } from '../types/response.type';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private userClientService: ClientProxy,
    @Inject('TOKEN_SERVICE') private tokenClientService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext) {
    const httpContext: HttpArgumentsHost = context.switchToHttp();
    const request: Request = httpContext.getRequest();

    const { authorization = undefined } = request?.headers as {
      authorization?: string;
    };
    if (!authorization)
      throw new UnauthorizedException('authorization header is missing');

    const [bearer, token] = authorization?.split(' ');
    if (!bearer || bearer?.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid authorization header');
    }

    if (!token) throw new UnauthorizedException('Token is missing');

    const verifyTokenResponse = await lastValueFrom<ResponseType>(
      this.tokenClientService.send<ResponseType>('verify_token', {
        token,
      }),
    );
    if (!verifyTokenResponse || verifyTokenResponse.error)
      throw new HttpException(
        verifyTokenResponse.message,
        verifyTokenResponse.status,
      );

    const { userId } = verifyTokenResponse?.data;
    if (!userId) throw new UnauthorizedException('Invalid token');

    const userResponse = await lastValueFrom<ResponseType>(
      this.userClientService.send<ResponseType>('get_user_by_id', {
        userId,
      }),
    );
    if (!userResponse || userResponse.error)
      throw new HttpException(userResponse.message, userResponse.status);

    if (!userResponse?.data?.user)
      throw new UnauthorizedException('User not found');

    request.user = userResponse?.data?.user;

    return true;
  }
}
