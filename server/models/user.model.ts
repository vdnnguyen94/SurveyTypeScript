import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface UserDocument extends Document {
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  companyName?: string;
  created?: Date;
  updated?: Date;
  hashed_password?: string;
  salt?: string;
  password?: string;
  _password?: string;
  authenticate(plainText: string): boolean;
  encryptPassword(password: string): string;
  makeSalt(): string;
}

const userSchema: Schema<UserDocument> = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true, 
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: true, 
  },
  companyName: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  hashed_password: {
    type: String,
    required: true, 
  },
  salt: String
});

userSchema.virtual('password')
  .set(function(this: UserDocument, password: string) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
    console.log(this.hashed_password);
  })
  .get(function(this: UserDocument) {
    return this._password;
  });

userSchema.path('hashed_password').validate(function(this: UserDocument, v: string) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
}, undefined);

userSchema.methods = {
  authenticate: function(this: UserDocument, plainText: string) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function(this: UserDocument, password: string) {
    if (!password || !this.salt) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      console.log(err);
      return '';
    }
  },
  makeSalt: function(this: UserDocument) {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

export default mongoose.model<UserDocument>('User', userSchema);
