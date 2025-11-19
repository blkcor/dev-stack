import { model, models, Schema, Model, Document, Types } from 'mongoose'

export interface IUser {
  name: string
  username: string
  email: string
  bio?: string
  avatar: string
  location?: string
  portfolio?: string
  reputation?: number
}

export interface IUserDoc extends Omit<Document, 'location'>, IUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
const UserSchema = new Schema<IUser>(
  {
    // the name is designed for display the user name(can contain some special characters)
    name: { type: String, required: true },
    // the username is designed for system internal use for url(/profile/xxx, can't contain special characters)
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    avatar: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

const User = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)

export default User
