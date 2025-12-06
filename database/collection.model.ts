import { Model, model, models, Schema, Types } from 'mongoose'

import { IQuestionDoc } from './question.model'
import { IUserDoc } from './user.model'

export interface ICollection {
  author: Types.ObjectId
  question: Types.ObjectId
}

export interface ICollectionDoc extends ICollection, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export type ICollectionAuthorQuestionPopulated = Omit<ICollectionDoc, 'author' | 'question'> & {
  author: IUserDoc
  question: IQuestionDoc
}

const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  },
  {
    timestamps: true,
  }
)

const Collection =
  (models.Collection as Model<ICollection>) || model<ICollection>('Collection', CollectionSchema)

export default Collection
