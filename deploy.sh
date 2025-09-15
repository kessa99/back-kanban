#!/bin/bash

# Script de déploiement pour l'application Kanban
set -e

echo " Démarrage du déploiement de l'application Kanban..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier que docker-compose est installé
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    print_error "Le fichier .env n'existe pas. Veuillez créer un fichier .env avec vos variables d'environnement."
    print_status "Vous pouvez copier .env.example vers .env et le modifier:"
    print_status "cp .env.example .env"
    exit 1
fi

# Vérifier que Docker est en cours d'exécution
if ! docker info &> /dev/null; then
    print_error "Docker n'est pas en cours d'exécution. Veuillez démarrer Docker."
    exit 1
fi

print_status "Vérifications préliminaires terminées "

# Arrêter les conteneurs existants
print_status "Arrêt des conteneurs existants..."
docker-compose down --remove-orphans

# Nettoyer les images orphelines
print_status "Nettoyage des images orphelines..."
docker system prune -f

# Construire et démarrer les conteneurs
print_status "Construction et démarrage des conteneurs..."
docker-compose up --build -d

# Attendre que les conteneurs soient prêts
print_status "Attente du démarrage des services..."
sleep 10

# Vérifier le statut des conteneurs
print_status "Vérification du statut des conteneurs:"
docker-compose ps

# Vérifier la santé de l'application
print_status "Vérification de la santé de l'application..."
if curl -f http://localhost:3000/health &> /dev/null; then
    print_success "L'application est en cours d'exécution et répond aux health checks! "
else
    print_warning "L'application ne répond pas encore aux health checks. Vérifiez les logs."
fi

# Afficher les informations de connexion
print_success "Déploiement terminé!"
echo ""
print_status " Application accessible sur:"
print_status "   - http://localhost:3000 (direct)"
print_status "   - http://localhost:80 (via nginx)"
echo ""
print_status " Commandes utiles:"
print_status "   - Voir les logs: docker-compose logs -f"
print_status "   - Arrêter: docker-compose down"
print_status "   - Redémarrer: docker-compose restart"
print_status "   - Statut: docker-compose ps"
echo ""

# Afficher les logs récents
print_status " Logs récents de l'application:"
docker-compose logs --tail=20 app
