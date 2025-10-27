import { model, models, Schema } from 'mongoose'

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

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    avatar: { type: String, required: true },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

const User = models.user || model<IUser>('User', userSchema)

export default User
