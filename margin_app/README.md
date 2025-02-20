# Spotnet2.0 Project

## Steps, to run API at localhost

### 1. Clone this repository

```bash
git clone https://github.com/djeck1432/spotnet
```

### 2. Set environment variables:

Rename ```example.env``` to ```.env``` with this command: ```mv .env.example .env``` and put your variables here

### 3. Start project with [docker compose](https://docs.docker.com/compose/)

1) [Install Docker](https://docs.docker.com/engine/install/) (if not already installed)
2) Start Docker
3) Run project
   
```bash
docker compose up
```

#### Also you need to create database and tables. You have 3 variants:

1) Use alembic
   
```bash
alembic upgrade head
```

2) Use postgres dumps **(if you create it before)**
   
```bash
./scripts/postgres/restore.sh
```

After that write name of this dump

3) Any other script you have

### 4. Link to API

You need to use [this link](http://127.0.0.1:8000), for access to API.

Good luck! 😁
