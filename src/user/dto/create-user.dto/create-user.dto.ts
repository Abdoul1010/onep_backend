// src/user/dto/create-user.dto.ts
export class CreateUserDto {
  prenom: string;
  nomEntreprise?: string;
  paysRegion: string;
  rue: string;
  ville: string;
  regionDepartement: string;
  codePostal?: string;
  telephone?: string;
  email: string;
  password: string;
  abonnement: string;
}
