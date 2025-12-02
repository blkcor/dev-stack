import { Model, model, models, Schema, Types } from 'mongoose'

type VoteTo = 'answer' | 'question'
type VoteType = 'upvote' | 'downvote'

export interface IVote {
  author: Types.ObjectId
  id: Types.ObjectId
  type: VoteTo
  voteType: VoteType
}

export interface IVoteDoc extends IVote, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['answer', 'question'], required: true },
    voteType: { type: String, enum: ['upvote', 'downvote'], required: true },
  },
  {
    timestamps: true,
  }
)

const Vote = (models.Vote as Model<IVote>) || model<IVote>('Vote', VoteSchema)

export default Vote
