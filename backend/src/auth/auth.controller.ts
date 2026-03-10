import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  registerTenant(@Body() registerDto: Record<string, any>) {
    return this.usersService.registerTenantOwner({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      tenantName: registerDto.tenantName
    } as any);
  }
}
