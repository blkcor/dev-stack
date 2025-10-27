import { model, models, Schema, Types } from 'mongoose'

export interface ITagQuestion {
  question: Types.ObjectId
  tagId: Types.ObjectId
}

const TagSchema = new Schema<ITagQuestion>(
  {
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    tagId: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
  },
  {
    timestamps: true,
  }
)

const TagQuestion = models.TagQuestion || model<ITagQuestion>('TagQuestion', TagSchema)

export default TagQuestion
