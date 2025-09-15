# Déploiement sur Railway

Ce guide explique comment déployer l'application Kanban sur Railway.

## Prérequis

- Compte Railway
- Variables d'environnement Firebase configurées

## Configuration Railway

### 1. Variables d'environnement requises

Configurez ces variables dans le dashboard Railway :

```
FIREBASE_PROJECT_ID=kanban-5a370
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kanban-5a370.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://kanban-5a370.firebaseio.com
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
PORT=3000
```

### 2. Déploiement

1. Connectez votre repository GitHub à Railway
2. Railway détectera automatiquement que c'est une application Node.js
3. Les fichiers `railway.json`, `Procfile`, et `start.sh` guideront le déploiement
4. Configurez les variables d'environnement dans le dashboard Railway

### 3. Fichiers de configuration

- `railway.json` : Configuration Railway
- `Procfile` : Commande de démarrage
- `start.sh` : Script de démarrage avec vérifications
- `.railwayignore` : Fichiers à ignorer lors du déploiement

### 4. Health Check

L'application expose un endpoint `/health` pour les health checks Railway.

### 5. Logs

Les logs sont disponibles dans le dashboard Railway sous l'onglet "Deployments".

## Dépannage

### Problèmes courants

1. **Variables d'environnement manquantes**
   - Vérifiez que toutes les variables Firebase sont configurées
   - Assurez-vous que `FIREBASE_PRIVATE_KEY` contient les `\n` pour les retours à la ligne

2. **Build échoue**
   - Vérifiez que `package.json` contient le script `start:prod`
   - Assurez-vous que toutes les dépendances sont dans `dependencies` et non `devDependencies`

3. **Application ne démarre pas**
   - Vérifiez les logs dans Railway
   - Assurez-vous que le port est configuré sur `process.env.PORT || 3000`

### Support

Pour plus d'aide, consultez la [documentation Railway](https://docs.railway.app/).
