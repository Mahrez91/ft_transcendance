# ft_transcendence-42

ft_transcendence project at 42 school

## description
This project is about creating a website for the mighty Pong contest!

# usage

### manual:
```sh
docker-compose up --build
```

### makefile:
```sh
make
```

### dev:
```sh
make dev
cd ./backend && npm run start:dev
cd ../frontend && npm run start
```

## access
enter http://localhost:3001 in your search bar

click sign in then get token

# languages

- Typescript

Back:
- NestJS
- TypeORM

Front:
- React

Database:
- PostgreSQL

# features

### security

- password hashed in db
- protected against SQL injections
- server-side validation for forms and any user input

### user account

- login using 42 intranet OAuth
- choose unique username
- upload an avatar, default avatar if none
- 2FA (two-factor authentication)
- friends list
- user status: online, offline, in a game
- stats: win, lose, elo, xp, level
- match history

### chat
- channels type: public, private, protected (proteced by password)
- direct messages
- block user (shadow mute someone from your chat UI)
- channel owner:
	- change channel type
	- add/remove/change password
	- set user as admin
- channel admin:
	- ban user
	- mute user
- challenge other to a pong game through UI
- access profile through UI

### pong
- matchmaking
- 3 game mode
- spectator
