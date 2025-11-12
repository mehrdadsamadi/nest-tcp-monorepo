import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserSignupDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UserLoginDto extends OmitType(UserSignupDto, ['name']) {}
