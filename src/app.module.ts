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
import { ConfigModule } from './config/module/config.module';
import { AuthModule } from './config/module/auth.module';
import { UsersModule } from './config/module/users.module';
import { TeamModule } from './config/module/team.module';
import { FirebaseModule } from './config/module/firebase.module';
import { BoardModule } from './config/module/boards.module';
import { HealthController } from './interface/controller/heath.controller';
import { AuthGuardFirebase } from './config/jwt/jwtAuth.guard';
import { TaskModule } from './config/module/task.module';

@Module({
  imports: [
    ConfigModule, // Global configuration and environment variables
    FirebaseModule, // Firebase services (Global)
    AuthModule, // Authentication and authorization
    UsersModule, // User management operations
    TeamModule, // Team management operations
    BoardModule, // Board management operations
    TaskModule, // Task management operations
  ],
  controllers: [HealthController],
  providers: [AuthGuardFirebase],
})
export class AppModule {}
