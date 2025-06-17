import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import serviceRoutes from './routes/servicos.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/servicos', serviceRoutes);

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
