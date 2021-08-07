# `Pricing Chris API`

## Purpose

The purpose of this document is to provide complete instructions Pricing Chris API deployment.

# Initial Deploy Setup

### Prerequisites

- To begin deployment, you must have installed:

  - `Docker` (version 20.10.8)
  - `docker-compose` (version 1.25.0)

## Environment Variables

_Variable List with Default Example Values:_

```
PORT : "3333"
HOST : "0.0.0.0"
NODE_ENV : "development"
APP_KEY : ""
DB_CONNECTION : "pg"
PG_HOST : "localhost"
PG_PORT : "5432"
PG_USER : "pedregulho"
PG_PASSWORD : ""
PG_DB_NAME : "pricing_db"
```

#### Environment Variables Values Explained

##### PORT

- The port where the application will be accessed
- Example Value: `3333`

##### HOST

- The host where the application will be accessed
- Example Value: `0.0.0.0`

##### NODE_ENV

- NodeJS environment
- Example Value: `development`

##### APP_KEY

- The secret to encrypt and sign different values in the application
- You must generate your own app key

##### DB_CONNECTION

- The primary connection for making database queries across the application
- Example Value: `pg`

##### PG_HOST

- The host where the database will be accessed
- Example Value: `localhost`

##### PG_PORT

- The port where the database will be accessed
- Example Value: `5432`

##### PG_USER

- The user who has access to the database
- Example Value: `pedregulho`

##### PG_PASSWORD

- The password the user uses to access the database

##### PG_DB_NAME

- The database name
- Example Value: `pricing_db`

### Execute Pricing Chris API deploy

- Make sure you have a correctly filled `.env` file:
  - Follow the pattern of the `.env.example` file and fill with your own values
- Execute the following command:
  - `docker login` (https://docs.docker.com/engine/reference/commandline/login/)
- In the root of the project, run the command below to build and deploy Pricing Chris API:
  - `docker-compose up`
- Access the API via Postman/Insomnia or browser with `http://localhost:3333`