/*import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
//import { Strategy } from 'passport-google-id-token';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-id-token') {
  constructor() {
    super({
      clientID: '246120328232-ev6m9ls9akpkv9t9a28g2mpihuv61kjg.apps.googleusercontent.com', // Google Console OAuth2
    });
  }

  async validate(payload: any): Promise<any> {
    const { email, given_name, family_name, picture } = payload;
    return {
      email,
      name: `${given_name} ${family_name}`,
      picture,
    };
  }
}*/

/*import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
//import { Strategy } from 'passport-google-id-token';

const Strategy = require('passport-google-id-token');

@Injectable()
export class GoogleIdTokenStrategy extends PassportStrategy(Strategy, 'google-id-token') {
  constructor() {
    super({
      clientID: '246120328232-srn7258q1idfak503e2chgk0mfen6knl.apps.googleusercontent.com',
    });
  }

  async validate(parsedToken: any, googleId: string, done: any) {
    const user = {
      googleId,
      email: parsedToken.email,
      firstName: parsedToken.given_name,
      lastName: parsedToken.family_name,
      picture: parsedToken.picture,
      emailVerified: parsedToken.email_verified,
    };

    done(null, user);
  }
}*/

// src/auth/strategies/google-id-token.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleIdTokenStrategy extends PassportStrategy(Strategy, 'google-id-token') {
  private googleClient: OAuth2Client;

  constructor() {
    super();
    this.googleClient = new OAuth2Client('246120328232-srn7258q1idfak503e2chgk0mfen6knl.apps.googleusercontent.com');
  }

  async validate(req: any): Promise<any> {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: '246120328232-srn7258q1idfak503e2chgk0mfen6knl.apps.googleusercontent.com',
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Token invalide');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      throw new UnauthorizedException('Token Google invalide');
    }
  }

  private extractTokenFromHeader(req: any): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.substring(7);
  }
}

/*import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
//import { Strategy } from 'passport-google-id-token';

const GoogleTokenStrategy = require('passport-google-id-token');

type VerifyCallback = (error: any, user?: any, info?: any) => void;

@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleTokenStrategy, 'google-id-token') {
  constructor() {
    super({
      clientID: '246120328232-srn7258q1idfak503e2chgk0mfen6knl.apps.googleusercontent.com', // ⚠️ Important
      //clientID: '246120328232-ev6m9ls9akpkv9t9a28g2mpihuv61kjg.apps.googleusercontent.com', // ⚠️ Important
    });
  }

  async validate(parsedToken: any, googleId: string, done: VerifyCallback): Promise<any> {
    const { payload } = parsedToken;

    const user = {
      googleId,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    return done(null, user); // => user injecté dans req.user
  }
}*/

