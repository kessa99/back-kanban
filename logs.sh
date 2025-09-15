#!/bin/bash

# Script pour afficher les logs de l'application

echo " Logs de l'application Kanban"
echo "================================"

# Vérifier si des conteneurs sont en cours d'exécution
if ! docker-compose ps | grep -q "Up"; then
    echo " Aucun conteneur n'est en cours d'exécution."
    echo " Démarrez l'application avec: ./deploy.sh"
    exit 1
fi

# Afficher les logs
echo " Affichage des logs en temps réel (Ctrl+C pour arrêter)..."
echo ""
docker-compose logs -f
