import { Model, model, models, Schema, Types } from 'mongoose'

export interface ICollection {
  author: Types.ObjectId
  question: Types.ObjectId
}

export interface ICollectionDoc extends ICollection, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
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
