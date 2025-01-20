# Simple-Game-Library

## But de l'application

Simple Game Library est une bibliothèque de jeux vidéos permettant de consulter divers jeux et de les sauvegarder dans des listes personnalsées.

Vous pouvez donc créer un compte, rechercher vos jeux préférées et ainsi pouvoir les trier comme bon vous semble et partager vos listes à vos amis.

## Installation

Il est nécessaire d'avoir [Bun](https://bun.sh) d'installé pour pouvoir lancer l'application.

Pour installer l'application vous devez vous rendre dans le répertoire du projet _(dossier du nom `Simple-Game-Library`)_.

Ensuite vous pouvez ouvrir un terminal et entrer la commande suivante :

```
bun install
```

copier le fichier `.env.example` et le renommer en `.env` puis remplir les informations suivantes :

```
BNET_CLIENT_ID=<bnet_client_id>
BNET_SECRET=<bnet_secret>
GMAIL_ACCOUNT=<gmail_email>
GMAIL_PASSWORD=<gmail_app_password>
STEAM_TOKEN=<steam_api_key>
DB_HOST=<db_host>
DB_USER=<db_user>
DB_PASS=<db_password>
DB_NAME=<db_name>
JWT_TOKEN=<jwt_token>
```

## Lancement de l'application

### En Local

Pour lancer l'application en local, vous pouvez utiliser la commande suivante _(il est nécessaire d'avoir une base de données lancée, comme MySQL ou MariaDB)_ :

```
bun start
```

### Avec Docker

Pour lancer l'application avec Docker, vous pouvez utiliser la commande suivante :

```
docker compose up -d
```

## Test de l'application

Pour lancer les tests de l'application vous pouvez lancer la commande suivante :

```
npm test
```

## Annexe

Voici quelques liens qui peuvent vous intéresser :

- [Notion de notes du projet](https://www.notion.so/SAE-1-0091ab23f59d4f25b810fbe6411220f3)
- [Rapport de projet](https://docs.google.com/document/d/1qDP2YHU26Ve78AwiqhcrBJ9E5G0NG6M8E1QmqGWBqpA/edit?usp=sharing)
- [Notre présentation](https://docs.google.com/presentation/d/11UMgiHuPRvpgh8Q_msfCI5zzWt5rzjRhEtyjuNQ3VOg/edit?usp=sharing)
