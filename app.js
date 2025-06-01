import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/users.js';
import mailRoutes from './src/routes/mails.js';
import labelRoutes from './src/routes/labels.js';
import blacklistRoutes from './src/routes/blacklist.js';

const app = express();
app.use(bodyParser.json());

//project routes
app.use('/api/users', userRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/blacklist', blacklistRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(3003);
//lsof -i :3003
//kill -9 pid