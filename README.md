# Game Vault

## But de l'application

Game Vault est une bibliothèque de jeux vidéos permettant de consulter divers jeux et de les sauvegarder dans des listes personnalsées.

Vous pouvez donc créer un compte, rechercher vos jeux préférées et ainsi pouvoir les trier comme bon vous semble et partager vos listes à vos amis.

## Installation

Il est nécessaire d'avoir [Bun](https://bun.sh) d'installé pour pouvoir lancer l'application.

Cloner le dépôt git

```
git clone https://github.com/Shrayzz/Game-Vault.git
```

Naviguer dans le dossier

```
cd Simple-Game-Library/
```

Installer les dépendances du projet

```
bun install
```

copier le fichier `.env.example` et le renommer en `.env` puis remplir les informations suivantes :

```
SERVER_PORT=<PORT_SERVER>

#API
XBOX_API_KEY=<YOUR_XBOX_live_API_KEY>
BNET_CLIENT_ID=<BNET_CLIENT_ID>
BNET_SECRET=<BNET_SECRET>
STEAM_TOKEN=<STEAM_TOKEN>

#Mail
GMAIL_ACCOUNT=<GMAIL_ACCOUNT>
GMAIL_PASSWORD=<GMAIL_APP_PASSWORD>

#Database
DB_HOST=<your_db_host>
DB_USER=<your_db_user>
DB_PASS=<your_db_password>
DB_NAME=<your_db_name>
DB_PORT=<your_db_port>
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
#bun
bun test

#node
npm test
```

## Annexe

Voici quelques liens qui peuvent vous intéresser :

- [Notion de notes du projet](https://www.notion.so/SAE-1-0091ab23f59d4f25b810fbe6411220f3)
- [Rapport de projet](https://docs.google.com/document/d/1qDP2YHU26Ve78AwiqhcrBJ9E5G0NG6M8E1QmqGWBqpA/edit?usp=sharing)
