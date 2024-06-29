import { Schema, model, InferSchemaType } from 'mongoose';
import validator from 'validator'
import bcryptjs from 'bcryptjs'

import { ApiError } from '../../lib';
import { IUser, Role } from '../../interfaces/user';

const schema = new Schema<IUser>({
    firstName : {
        type :      String,
        minLength : [3, 'First name must be at least 3 characters'],
        maxLength : [15, 'First name must be at less than 15 characters'],
        required :  [true, 'First name is a required field'],
        trim :      true,
      },
      lastName : {
        type :      String,
        minLength : [3, 'Last name must be at least 3 characters'],
        maxLength : [15, 'Last name must be at less than 15 characters'],
        required :  [true, 'Last name is a required field'],
        trim :      true,
    },
    userName: {
      type: String,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [30, 'Username must be at less than 30 characters'],
      required: [true, 'Username is a required field'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      unique: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new ApiError('Invalid email', 400);
        }
      },
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      trim: true,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
}, {
  timestamps: true,
  versionKey: false,
})

schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

schema.methods.comparePassword = async function (password: string): Promise<Boolean> {
  return bcryptjs.compare(password, this.password);
};

schema.pre('save', async function () {
  if (this.isModified('password')) 
    this.password = await bcryptjs.hash(this.password, 10);
});

type userType = InferSchemaType<typeof schema>;
const User = model<IUser>('User', schema)

export { User, userType }
