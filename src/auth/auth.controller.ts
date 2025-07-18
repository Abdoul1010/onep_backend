
import { Controller, Post, Body, Req, UseGuards, ValidationPipe, Query, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    
    return {
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        emailVerified: user.emailVerified,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
    };
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    
    return {
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        emailVerified: user.emailVerified,
        authProvider: user.authProvider,
      },
    };
  }

  @Post('google')
  @UseGuards(AuthGuard('google-id-token'))
  async loginGoogle(@Req() req) {
    const googleUser = req.user;
    const user = await this.authService.findOrCreateGoogleUser(googleUser);

    return {
      message: 'Connexion avec Google réussie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        emailVerified: user.emailVerified,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
      isNewUser: user.createdAt.getTime() === user.updatedAt.getTime(),
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /*@Get('validate-reset-token')
  async validateResetToken(@Query('token') token: string) {
    const isValid = await this.authService.validateResetToken(token);
    return { valid: isValid };
  }*/
}
