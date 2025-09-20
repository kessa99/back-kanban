# Guide Docker - Backend Kanban

Ce guide vous explique comment lancer le projet backend Kanban avec Docker.

## 📋 Prérequis

- Docker installé sur votre machine
- Docker Compose installé
- Un fichier `.env` configuré (voir section Configuration)

## 🚀 Lancement rapide

### 1. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Application Configuration
NODE_ENV=production
PORT=3000
```

### 2. Test de la configuration (recommandé)

```bash
# Tester la configuration Docker avant le déploiement
./test-docker.sh
```

### 3. Lancement avec Docker Compose

```bash
# Construire et lancer les conteneurs
docker-compose up --build

# Lancer en arrière-plan
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter les conteneurs
docker-compose down
```

### 4. Vérification

Une fois lancé, l'API sera disponible sur :
- **URL locale** : http://localhost:3000
- **Health check** : http://localhost:3000/health

Testez avec curl :
```bash
curl http://localhost:3000/health
```

## 🐳 Configuration Docker

### Dockerfile

Le projet utilise un build multi-étapes optimisé :

- **Étape 1 (Builder)** : Installation des dépendances et compilation TypeScript
- **Étape 2 (Production)** : Image finale avec uniquement les fichiers nécessaires

### Docker Compose

Le fichier `docker-compose.yml` configure :

- **Service app** : Application NestJS
- **Port** : 3000 (mappé sur le port 3000 de l'hôte)
- **Health check** : Vérification automatique de l'état de l'application
- **Réseau** : `kanban-network` pour l'isolation
- **Restart policy** : `unless-stopped`

## 🔧 Commandes utiles

### Gestion des conteneurs

```bash
# Voir les conteneurs en cours
docker-compose ps

# Redémarrer un service
docker-compose restart app

# Reconstruire sans cache
docker-compose build --no-cache

# Voir les logs d'un service spécifique
docker-compose logs app

# Exécuter une commande dans le conteneur
docker-compose exec app sh
```

### Gestion des images

```bash
# Construire l'image manuellement
docker build -t kanban-backend .

# Lancer l'image manuellement
docker run -p 3000:3000 --env-file .env kanban-backend

# Nettoyer les images inutilisées
docker system prune -a
```

## 🏗️ Architecture Docker

```
back-kanban/
├── Dockerfile              # Configuration de l'image Docker
├── docker-compose.yml      # Orchestration des services
├── nginx.conf             # Configuration Nginx (optionnel)
├── .env                   # Variables d'environnement
└── src/                   # Code source de l'application
```

## 🔍 Dépannage

### Problèmes courants

1. **Health check failed - Service unavailable**
   ```bash
   # Vérifier les logs du conteneur
   docker-compose logs app
   
   # Vérifier que les variables Firebase sont correctement configurées
   docker-compose exec app env | grep FIREBASE
   
   # Tester manuellement le health endpoint
   curl -v http://localhost:3000/health
   ```

2. **Port déjà utilisé**
   ```bash
   # Changer le port dans docker-compose.yml
   ports:
     - "3001:3000"  # Utiliser le port 3001 au lieu de 3000
   ```

3. **Variables d'environnement manquantes**
   ```bash
   # Vérifier que le fichier .env existe et contient toutes les variables
   cat .env
   
   # Vérifier que les variables sont bien chargées dans le conteneur
   docker-compose exec app printenv
   ```

4. **Problème de permissions Firebase**
   ```bash
   # Vérifier que la clé privée Firebase est correctement formatée
   # Les \n doivent être des vrais retours à la ligne
   echo $FIREBASE_PRIVATE_KEY | head -c 50
   ```

5. **Conteneur ne démarre pas**
   ```bash
   # Voir les logs détaillés
   docker-compose logs app
   
   # Redémarrer avec rebuild
   docker-compose down
   docker-compose up --build
   
   # Tester avec le script de test
   ./test-docker.sh
   ```

### Vérification de l'état

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Vérifier les health checks
docker inspect kanban-backend | grep -A 10 Health

# Tester l'API
curl -X GET http://localhost:3000/health
```

## 📊 Monitoring

### Health Checks

L'application inclut des health checks automatiques :

- **Intervalle** : 30 secondes
- **Timeout** : 3 secondes
- **Retries** : 3 tentatives
- **Endpoint** : `/health`

### Logs

```bash
# Suivre les logs en temps réel
docker-compose logs -f app

# Logs avec timestamps
docker-compose logs -f -t app

# Logs des 100 dernières lignes
docker-compose logs --tail=100 app
```

## 🚀 Déploiement en production

### Variables d'environnement de production

Assurez-vous que ces variables sont configurées :

```bash
NODE_ENV=production
PORT=3000
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_PRIVATE_KEY="your-production-private-key"
FIREBASE_CLIENT_EMAIL=your-production-service-account@project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-production-project.firebaseio.com
JWT_SECRET=your-production-jwt-secret
EMAIL_HOST_USER=your-production-email@gmail.com
EMAIL_HOST_PASSWORD=your-production-app-password
```

### Optimisations de production

1. **Utiliser des secrets Docker** pour les variables sensibles
2. **Configurer un reverse proxy** (Nginx) pour la production
3. **Implémenter des logs structurés** pour le monitoring
4. **Configurer des backups** de la base de données Firebase

## 📚 Ressources supplémentaires

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation NestJS](https://nestjs.com/)
- [Documentation Firebase](https://firebase.google.com/docs)

---

**Note** : Ce projet utilise Firebase Firestore comme base de données. Assurez-vous d'avoir configuré correctement votre projet Firebase avant de lancer l'application.
