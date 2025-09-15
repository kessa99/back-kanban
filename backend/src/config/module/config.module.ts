/*
  Config.Module est le module de configuration de l'application.
  Il est utilisé pour charger les variables d'environnement.

*/

import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt/jwt.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [JwtConfigService],
  exports: [JwtConfigService], // Exporte pour réutilisation
})
export class ConfigModule {}