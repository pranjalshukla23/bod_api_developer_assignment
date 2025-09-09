import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // <- specify OpenAPI version
    info: {
      title: 'BOD Inventory Management API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: `http://localhost:8080`, // your base URL
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.ts')], // resolves routes correctly
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
