/*
    User.Module is a module that handles the user data.
    It is used to create, find, update and delete users.
    It is used to handle the user data.
    It is used to handle the user data.
*/

/* 
    User.Module est un module qui gère les données de l'utilisateur.
    Il est utilisé pour créer, trouver, mettre à jour et supprimer des utilisateurs.
    Il est utilisé pour gérer les données de l'utilisateur.
    Il est utilisé pour gérer les données de l'utilisateur.
*/

import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "src/interface/service/user.service";
import { FirebaseUserRepository } from "src/infrastructure/repositories/firebase-user.repository";
import { HealthController } from "../controller/heath.controller";

@Module({
  controllers: [UserController, HealthController],
  providers: [UserService, FirebaseUserRepository],
})
export class UserModule {}