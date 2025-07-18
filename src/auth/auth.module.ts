import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/user.entity'; // ajuste ce chemin
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { GoogleIdTokenStrategy } from './google.strategy';
import { PasswordReset } from './password-reset.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset]), // <== très important
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_key', // à mettre dans .env
      signOptions: { expiresIn: '1d' }, // Durée de validité du token
    }),
    /*JwtModule.register({
      secret: 'secretKey', // à mettre dans .env
      signOptions: { expiresIn: '1d' },
    }),*/
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM}>`,
      },
      template: {
        dir: process.cwd() + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleIdTokenStrategy],
})
export class AuthModule {}
