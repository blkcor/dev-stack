import { model, models, Schema, Model, Types } from 'mongoose'

export interface ITag {
  name: string
  questions: number
}

export interface ITagDoc extends ITag, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    questions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

const Tag = (models.Tag as Model<ITag>) || model<ITag>('Tag', TagSchema)

export default Tag
