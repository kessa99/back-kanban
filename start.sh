#!/bin/bash

# Script de démarrage pour Railway
echo " Démarrage de l'application Kanban sur Railway..."

# Vérifier que les variables d'environnement sont définies
if [ -z "$FIREBASE_PROJECT_ID" ]; then
    echo " FIREBASE_PROJECT_ID n'est pas défini"
    exit 1
fi

if [ -z "$FIREBASE_PRIVATE_KEY" ]; then
    echo " FIREBASE_PRIVATE_KEY n'est pas défini"
    exit 1
fi

if [ -z "$FIREBASE_CLIENT_EMAIL" ]; then
    echo " FIREBASE_CLIENT_EMAIL n'est pas défini"
    exit 1
fi

echo " Variables d'environnement vérifiées"

# Démarrer l'application
echo " Démarrage de l'application..."
npm run start:prod
