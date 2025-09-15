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

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from '../../interface/service/user.service';
import { AuthService } from '../../interface/service/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


@Injectable()
export class AuthGuardFirebase implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.authService.validateRequest(request);
  }
}