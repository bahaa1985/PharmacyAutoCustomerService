import express from 'express';
import { USER_ROUTER } from './modules/user/user.route';
import { AUTH_ROUTER } from './modules/auth/login.route'
import { PHARMACY_ROUTER } from './modules/pharmacy/pharmacy.route';


const app = express();

// Middleware
app.use(express.json());

app.get('/', (req: any, res: any) => {
  res.send('Hello World!');
});

app.use('/user', USER_ROUTER)
app.use('/login', AUTH_ROUTER)
app.use('/pharmacy', PHARMACY_ROUTER)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});