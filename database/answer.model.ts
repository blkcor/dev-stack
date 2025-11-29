import { model, models, Schema, Types, Model } from 'mongoose'

import { IUserDoc } from './user.model'

export interface IAnswer {
  author: Types.ObjectId
  question: Types.ObjectId
  content: string
  upvotes: number
  downvotes: number
}

export interface IAnswerDoc extends IAnswer, Document {
  _id: Types.ObjectId
  createdAt: string
  updatedAt: string
}

export type IAnswerAuthorPopulated = {
  _id: string
  author: Pick<IUserDoc, '_id' | 'name' | 'avatar'>
  content: string
  createdAt: string
  updatedAt: string
}

const AnswerSchema = new Schema<IAnswer>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

const Answer = (models.Answer as Model<IAnswer>) || model<IAnswer>('Answer', AnswerSchema)

export default Answer
