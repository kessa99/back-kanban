/**
 * App Module - Main Application Module
 * 
 * This is the root module that imports and configures all other modules:
 * - ConfigModule: Global configuration and environment variables
 * - FirebaseModule: Firebase services (Global)
 * - AuthModule: Authentication and authorization
 * - UsersModule: User management operations
 * - TeamModule: Team management operations
 * 
 * This module serves as the entry point for the entire application.
 * All other modules are imported here to make them available throughout the app.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/module/config.module';
import { AuthModule } from 'src/config/module/auth.module';
import { UsersModule } from 'src/config/module/users.module';
import { TeamModule } from 'src/config/module/team.module';
import { FirebaseModule } from 'src/config/module/firebase.module';
import { BoardModule } from 'src/config/module/boards.module';

@Module({
  imports: [
    ConfigModule, // Global configuration and environment variables
    FirebaseModule, // Firebase services (Global)
    AuthModule, // Authentication and authorization
    UsersModule, // User management operations
    TeamModule, // Team management operations
    BoardModule, // Board management operations
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}