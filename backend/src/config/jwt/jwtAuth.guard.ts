/**
 * @description JWT authentication guard
 * elle est utilisée pour protéger les routes qui nécessitent une authentification
 * elle est utilisée pour vérifier si le token est valide
 * elle est utilisée pour récupérer les informations de l'utilisateur à partir du token
 * elle est utilisée pour vérifier si l'utilisateur a les permissions nécessaires pour accéder à la route
 * elle est utilisée pour vérifier si l'utilisateur est authentifié
 * elle est utilisée pour vérifier si l'utilisateur est autorisé à accéder à la route
 * elle est utilisée pour vérifier si l'utilisateur est autorisé à accéder à la route
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}