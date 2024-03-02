import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
//import expressjwt from 'express-jwt';

import config from '../config/config';
declare global {
  namespace Express {
      interface Request {
          profile?: any; // Define the type for req.profile
          auth?: any;    // Define the type for req.auth
      }
  }
}
const signin = async (req: Request, res: Response) => {
    try {
        let user = await User.findOne({ "username": req.body.username });
        if (!user)
            return res.status(401).json({ error: "User not found" });

        if (!user.authenticate(req.body.password)) {
            return res.status(401).send({ error: "Username and password don't match." });
        }

        const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '24h' });
        res.cookie('SurveyApp', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        return res.json({
            token,
            user: {
                _id: user._id,
                name: userName,
                email: user.email,
                username: user.username
            }
        });
    } catch (err) {
        return res.status(401).json({ error: "Could not sign in" });
    }
};

const signout = (req: Request, res: Response) => {
    res.clearCookie("SurveyApp");
    return res.status(200).json({
        message: "signed out"
    });
};

import { expressjwt as expressJwt } from 'express-jwt';
const requireSignin  = expressJwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    requestProperty: 'auth'
});

const hasAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
};

export default { signin, signout, requireSignin, hasAuthorization };
