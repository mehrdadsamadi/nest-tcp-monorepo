import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @MessagePattern('create_user_token')
  createUserToken({ userId }: { userId: string }) {
    return this.tokenService.createUserToken(userId);
  }

  @MessagePattern('verify_token')
  verifyToken({ token }: { token: string }) {
    return this.tokenService.verifyToken(token);
  }

  @MessagePattern('delete_user_token')
  deleteUserToken({ userId }: { userId: string }) {
    return this.tokenService.deleteUserToken(userId);
  }
}
