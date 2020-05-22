import express, { Application } from 'express';
import morgan from 'morgan';

const bodyParser = require('body-parser')
const cors = require('cors')

import AuthController from './routes/auth';
import UserController from './routes/user';

const app: Application = express();

// settings
app.set('port', 3000 || process.env.PORT);

// Middlewares
app.use(morgan('dev'));
/*app.use(express.urlencoded({ extended: true }))
app.use(express.json());*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Routes
app.use('/api/auth', AuthController);
app.use('/api/user', UserController);
export default app;