#!/bin/bash

# Script pour arrêter l'application

echo " Arrêt de l'application Kanban..."

# Arrêter les conteneurs
docker-compose down

echo " Application arrêtée avec succès!"

# Optionnel: nettoyer les images
read -p " Voulez-vous aussi nettoyer les images Docker? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo " Nettoyage des images..."
    docker system prune -f
    echo " Nettoyage terminé!"
fi
