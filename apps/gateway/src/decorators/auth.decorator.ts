import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';

export function AuthDecorator() {
  return applyDecorators(ApiBearerAuth('Authorization'), UseGuards(AuthGuard));
}
