import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { Request, Response, NextFunction } from 'express';
import config from './config/config';
import { inventoryRoutes } from './routes/inventory.route';
import { swaggerDocs } from './swagger/swagger';

const app = express();

app.use(cors());
app.use(express.json());

//swagger documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (_, res) => {
  res.status(200).json({
    message: 'Api is healthy...',
  });
});

//inventory endpoints
app.use('/inventory', inventoryRoutes);

// middleware to handle internal server errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Internal server error';

  res.status(500).json({ message: message });
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
