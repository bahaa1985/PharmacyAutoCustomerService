import express from 'express';
import { USER_ROUTER } from './modules/user/user.route';
import { AUTH_LOGIN_ROUTER } from './modules/auth/login.route'
import { AUTH_LOGOUT_ROUTER } from './modules/auth/logout.route';
import { PHARMACY_ROUTER } from './modules/pharmacy/pharmacy.route';
import { authenticateToken } from './middleware/authenticateToken';


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')())

app.get('/',authenticateToken, (req: any, res: any) => {
  if(!req.user){
    res.redirect('/login')
  }
  const username = req.user?.username
  res.send('Hello '+username+ ' !')
});

app.use('/user', USER_ROUTER)
app.use('/login', AUTH_LOGIN_ROUTER)
app.use('/logout', AUTH_LOGOUT_ROUTER)
app.use('/pharmacy', PHARMACY_ROUTER)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});