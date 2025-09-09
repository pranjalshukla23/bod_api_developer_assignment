# Inventory Warehouse Management API (v1.0)

- This is a backend system built for managing and synchronizing inventory with the help of a central database and external warehouse management system (wms). The backend architecture is designed using the following technologies: **Node.js**, **Express.js**, **TypeScript**, **PrismaORM**, **postegreSql**

## Table of Contents
- [Features Implemente](#features)
- [Setup & Execution](#setup--execution)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [API Endpoints](#api-endpoints)
- [Assumptions & Limitations](#assumptions--limitations)

--

## Features Implemented
- Retrieved inventory information from the central database by SKU utilizing a **retry** mechanism incase of database or external system failure.
- Synced inventory from external WMS (mocked JSON file) to central database by applying the **rate limiting mechanism** to protect the endpoint.
- Utilzed **TypeScript** to design a modular, scalable and reusable code with the help of type-checking and modular design pattern.
- Implemented **Error handling and logging** to debug code issues, and to handle failure scenarios through efficient exception handling.
- Documented the API endpoints using **Swagger** to provide information about the usecase of each endpoint, how to call each endpoint and generate response.
- Used **Docker-compose** to set up PostgreSQL, eliminating the need for a local database installation and simplifying environment configuration

--

## Setup and Configurations
1. Clone the repository
```
git clone https://github.com/pranjalshukla23/bod_api_developer_assignment
cd bod_api_developer_assignment
```

2. install the dependencies through npm
```
npm install
```

3. create a **.env** file in the project root directory with the required configurations mentioned below
```
PORT=8080
NODE_ENV=development

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgrespass
POSTGRES_DB=inventory

DATABASE_URL=postgres://postgres:postgrespass@localhost:5433/inventory
```

4. start **postgreSQL** using of **docker-compose** file
```
docker-compose up -d
```

5. Initialize prisma and run the migrations using the commands below:
```
npx prisma init
npx prisma generate
npx prisma db push
npx prisma migrate
```

6. Start the prisma studio to view the database in a grpahical UI:
```
npx prisma studio
```

7. Run the Application
```
npm run dev
```

---

## Architecture and design decisions:
- Node.js: It's a lightweight server with REST API routing capability making it ideal for small to medium scale projects
- TypeScript: Used due to it's strict type-checking capability, modular approach and error detection at run-time and compile time.
- PostgreSQL:  Relational Database to store inventory data for this use-case.
- Prisma ORM: Object relational model to interact with postgreSQL database and tables, making it easier to map data while coding.
- Swagger: Tool utilized for API documentation and testing
- Docker: For setting up the local development environment, which can remain consistent with other developers who are working on the same code.
- Retry Mechanism: Impelemented a retry mechanism (5 attempts) to retry DB operation of fetching inventory data from central database, to handle scenerios when the external system is unavilable.
- Rate limting: Implemented a rate limiting policy for **/inventory/sync** endpoint to prevent server from overloading and at the same time maintaining fair usage and system stability.

--

## API Endpoints: 
- GET /inventory/:sku – Retrieve inventory by SKU from internal database (postgreSQL).
- GET /inventory – Retrieve all inventory items from the internal database (postgreSQL).
- POST /inventory/sync – Trigger inventory sync from WMS (mocked json file).

--

## Assumptions & Limitations

- Assuming that **sku** will be alphanumeric and will be validated by the backend.
- External WMS data is simulated or being mocked using a local json file named **mockedData.json**.
- Assuming the request body of **POST /inventory/sync** is optional (provider and skuList); if not provided -> syncs all records in wms with the internal database.
- Currently Error handling logic is implemented for DB related oprations and internal rutime exceptions; network failures such as bad gateway or service unavailable are not fully handled in the backend through the exception handling.
- No authentication or authorization mechanism is implemented for protecting the endpoints.
- Deployment configurations for different environments are not defined.
