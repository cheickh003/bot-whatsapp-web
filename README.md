# Bot WhatsApp - Interface Web Admin

Interface d'administration web pour le bot WhatsApp, construite avec Next.js et connectée à Appwrite.

## Fonctionnalités

- 🔐 **Authentification sécurisée** avec PIN
- 📊 **Dashboard** avec métriques en temps réel
- 📅 **Gestion des réservations** (terrains de sport)
- 💬 **Visualisation des conversations** WhatsApp
- 🎫 **Gestion des tickets** de support
- 📈 **Rapports** et analytics

## Installation

1. Installer les dépendances:
```bash
cd web
npm install
```

2. Configurer les variables d'environnement:
```bash
cp .env.example .env
# Éditer .env avec vos paramètres Appwrite
```

3. Démarrer le serveur de développement:
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Structure du projet

```
web/
├── app/                    # Pages et routes Next.js
│   ├── api/               # Routes API
│   ├── dashboard/         # Pages du dashboard
│   └── login/             # Page de connexion
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
│   ├── appwrite.ts       # Client Appwrite
│   └── auth.ts           # Gestion de l'authentification
├── hooks/                 # Hooks React personnalisés
└── types/                 # Types TypeScript
```

## Connexion

- **Numéro de téléphone**: Utilisez votre numéro admin (ex: 2250703079410)
- **Code PIN**: 1234 (par défaut)

## Déploiement sur Appwrite Sites

1. Build de production:
```bash
npm run build
```

2. Déployer sur Appwrite Sites:
- Activer Sites dans la console Appwrite
- Suivre les instructions de déploiement
- Configurer le domaine personnalisé

## Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Appwrite SDK** - Backend as a Service
- **React Hooks** - Gestion d'état

## Développement

```bash
# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Lancer en production
npm start

# Vérifier le code
npm run lint
```

## Sécurité

- Sessions expirées après 24h
- PIN requis pour l'authentification
- Toutes les actions admin sont loggées
- HTTPS requis en production