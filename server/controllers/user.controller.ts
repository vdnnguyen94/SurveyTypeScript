import { Request, Response, NextFunction } from 'express';
import User, { UserDocument } from '../models/user.model';
import extend from 'lodash/extend';
import errorHandler from './error.controller';

// Define a new interface extending Request
declare global {
    namespace Express {
      interface Request {
        profile?: any
      }
    }
  }

const create = async (req: Request, res: Response) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: 'Successfully signed up!',
    });
  } catch (err: any) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      // Duplicate username error
      return res.status(400).json({
        error: 'Username is already taken.',
      });
    } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      // Duplicate email error
      return res.status(400).json({
        error: 'Email is already taken.',
      });
    } else {
      // Other validation errors
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  }
};

const list = async (req: Request, res: Response) => {
  try {
    let users = await User.find().select('username firstName lastName email companyName updated created');
    res.json(users);
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req: Request, res: Response, next: NextFunction, id: string) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: 'User not found',
      });
    req.profile = user;
    next();
  } catch (err: any) {
    return res.status(400).json({
      error: 'Could not retrieve user',
    });
  }
};

const read = (req: Request, res: Response) => {
    const user = req.profile as UserDocument;
    // Check if user exists to avoid null or undefined errors
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  }

const update = async (req: Request, res: Response) => {
  try {
    let user = req.profile as UserDocument;
    user = extend(user, req.body);
    await user.save();;
    res.json({
      message: 'Your Account is Updated Successfully',
      user,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    let user = req.profile as UserDocument;
    let deletedUser = await user.deleteOne();

    res.json({
      message: 'Your Account has been successfully removed',
      user: deletedUser,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
	  const { oldPassword, newPassword, newPasswordConfirm } = req.body;
	  const user = req.profile;
  
	  if (!user.authenticate(oldPassword)) {
		return res.status(401).json({
		  error: "Incorrect old password",
		});
	  }
    if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ error: "New password and confirmation do not match." });
    }
	  user.password = newPassword; 
	  user.updated = Date.now();
  
	  await user.save();
  
	  user.hashed_password = undefined;
	  user.salt = undefined;
  
	  res.json({ message: "Password updated successfully.", user });
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
	  const { username, email, newPassword, newPasswordConfirm } = req.body;
  
	  // Check if username and email match
	  const user = await User.findOne({ username, email });
	  if (!user) {
		return res.status(401).json({ error: "Username and email do not match." });
	  }
  
	  // Check if newPassword and newPasswordConfirm are equal
	  if (newPassword !== newPasswordConfirm) {
		return res.status(400).json({ error: "New password and confirmation do not match." });
	  }
  
	  // Set the new password and update the user
	  user.password = newPassword;
	  await user.save();
  
	  // Clear sensitive information before sending the response
	  user.hashed_password = undefined;
	  user.salt = undefined;
  
	  res.json({ message: "Password reset successfully.", user });
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};



const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const existingUser = await User.findOne({ email });
  
    if (existingUser) {
      return res.json({ error: 'Email is already taken.' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const checkUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  
  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ error: 'Username is already taken.' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const pass = async (req: Request, res: Response, next: NextFunction, id: string) => {
  try {
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve user',
    });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  updatePassword,
  resetPassword,
  checkEmail,
  checkUsername,
  pass
};
