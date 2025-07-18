// src/auth/auth.service.ts
/*import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
  	private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(data: CreateUserDto): Promise<User> {
  	// Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    //const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  /*async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }*/

 /* async login(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });

    /*if (!user || user.password !== password) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }*/

  /*  if (!user) {
    throw new UnauthorizedException('Utilisateur non trouvé');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Connexion réussie',
      user: {
        id: user.id,
        prenom: user.prenom,
        email: user.email,
      },
    };
  }
}
*/

// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordReset } from './password-reset.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private mailerService: MailerService,
  ) {}

  // Inscription classique
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });

    if (existingUser) {
      if (existingUser.authProvider === 'google') {
        // Utilisateur Google existant - ajouter le password
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.authProvider = 'both';
        await this.userRepository.save(existingUser);
        
        console.log('Compte Google lié avec mot de passe:', email);
        return existingUser;
      } else {
        throw new ConflictException('Un compte avec cet email existe déjà');
      }
    }

    // Créer nouvel utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      authProvider: 'local',
      emailVerified: false,
    });

    await this.userRepository.save(user);
    console.log('Nouvel utilisateur créé:', email);
    return user;
  }

  // Connexion classique
  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ 
      where: { email } 
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.password) {
      throw new UnauthorizedException('Ce compte utilise Google Sign-In. Veuillez vous connecter avec Google.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    console.log('Connexion réussie:', email);
    return user;
  }

  // Connexion/Inscription Google
  async findOrCreateGoogleUser(googleUserData: any): Promise<User> {
    const { googleId, email, firstName, lastName, picture, emailVerified } = googleUserData;

    // Chercher l'utilisateur existant par googleId ou email
    let user = await this.userRepository.findOne({
      where: [
        { googleId },
        { email }
      ]
    });

    if (user) {
      // Utilisateur existant
      if (!user.googleId) {
        // Utilisateur local existant - lier avec Google
        user.googleId = googleId;
        user.authProvider = user.password ? 'both' : 'google';
        console.log('Compte local lié avec Google:', email);
      }
      
      // Mettre à jour les infos
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.picture = picture || user.picture;
      user.emailVerified = emailVerified || user.emailVerified;

      await this.userRepository.save(user);
      console.log('Utilisateur existant connecté via Google:', email);
      return user;
    } else {
      // Nouvel utilisateur Google
      user = this.userRepository.create({
        googleId,
        email,
        firstName,
        lastName,
        picture,
        emailVerified,
        authProvider: 'google',
      });

      await this.userRepository.save(user);
      console.log('Nouvel utilisateur créé via Google:', email);
      return user;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({ 
      where: { email } 
    });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si l'utilisateur a un mot de passe (pas seulement Google)
    if (user.authProvider === 'google' && !user.password) {
      throw new BadRequestException('Ce compte utilise Google OAuth. Veuillez vous connecter avec Google.');
    }

    // Supprimer les anciens tokens non utilisés
    await this.passwordResetRepository.delete({
      userId: user.id,
      used: false
    });

    // Générer un nouveau token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token
    const passwordReset = this.passwordResetRepository.create({
      token,
      userId: user.id,
      expiresAt,
      used: false
    });

    await this.passwordResetRepository.save(passwordReset);

    // Envoyer l'email
    await this.sendResetPasswordEmail(user.email, token, user.firstName);

    return { message: 'Email de récupération envoyé' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    // Vérifier le token
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token, used: false },
      relations: ['user']
    });

    if (!passwordReset) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    // Vérifier l'expiration
    if (passwordReset.expiresAt < new Date()) {
      throw new BadRequestException('Token expiré');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await this.userRepository.update(passwordReset.userId, {
      password: hashedPassword,
      // Si c'était un compte Google, on le met en "both"
      authProvider: passwordReset.user.authProvider === 'google' ? 'both' : 'local'
    });

    // Marquer le token comme utilisé
    await this.passwordResetRepository.update(passwordReset.id, {
      used: true
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  private async sendResetPasswordEmail(email: string, token: string, firstName: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'reset-password',
      context: {
        firstName,
        resetUrl,
        expirationTime: '1 heure'
      }
    });
  }

  /*async validateResetToken(token: string): Promise<boolean> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token, used: false }
    });

    return passwordReset && passwordReset.expiresAt > new Date();
  }*/
}