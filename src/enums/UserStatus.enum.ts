import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  ACTIF = 'actif',
  INACTIF = 'inactif',
}

// On enregistre l'énumération pour GraphQL
registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: "Statut de l'utilisateur",
});
