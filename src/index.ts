import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import messageRoutes from '../src/routes/messageRoutes';
import templateRoutes from '../src/routes/templateRoutes';
import sprintRoutes from '../src/routes/sprintRoutes';
import userRoutes from '../src/routes/userRoutes';
import { errorHandler } from '../src/middleware/errorHandler';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.use('/messages', messageRoutes);
app.use('/templates', templateRoutes);
app.use('/sprints', sprintRoutes);
app.use('/users', userRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
