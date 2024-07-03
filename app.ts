import express from 'express';
import { db } from './src/database';
import messageRoutes from './src/routes/messageRoutes';
import templateRoutes from './src/routes/templateRoutes';
import sprintRoutes from './src/routes/sprintRoutes';
import userRoutes from './src/routes/userRoutes';
import { createAndSendMessage } from './src/services/messageService';
import { errorHandler } from './src/middleware/errorHandler';
import 'dotenv/config';

const app = express();

app.use(express.json());

// Route to send congratulatory message after sprint completion
app.post('/api/complete-sprint', async (req, res) => {
  const { username, sprintCode } = req.body;
  try {
    await createAndSendMessage(username, sprintCode);
    res.status(200).json({ message: 'Congratulatory message sent!' });
  } catch (error) {
    console.error('Error sending congratulatory message:', error);
    res.status(500).json({
      error: 'Failed to send congratulatory message',
    });
  }
});

// Use your routes
app.use('/messages', messageRoutes);
app.use('/templates', templateRoutes);
app.use('/sprints', sprintRoutes);
app.use('/users', userRoutes);

// Use error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
