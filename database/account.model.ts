import { model, models, Schema, Types, Model } from 'mongoose'

export interface IAccount {
  userId: Types.ObjectId
  name: string
  avatar?: string
  password?: string
  provider: string
  providerAccountId: string
}

export interface IAccountDoc extends IAccount, Document {
  _id: Types.ObjectId
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const Account = (models.Account as Model<IAccount>) || model<IAccount>('Account', AccountSchema)

export default Account
