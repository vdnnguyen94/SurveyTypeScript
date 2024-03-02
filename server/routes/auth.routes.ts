import express from 'express';
import authCtrl from '../controllers/auth.controller'; // Update extension to .ts

const router = express.Router();

router.route('/auth/signin').post(
  authCtrl.signin as (req: express.Request, res: express.Response) => void // Type assertion for signin
);

router.route('/auth/signout').get(
  authCtrl.signout as (req: express.Request, res: express.Response) => void // Type assertion for signout
);

export default router;
