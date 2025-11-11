import { Model, model, models, Schema, Types } from 'mongoose'

//  use this model for Recommended Algorithms

export interface IInteraction {
  user: Types.ObjectId
  action: string
  actionId: Types.ObjectId
  actionType: 'question' | 'answer'
}

export interface IInteractionDoc extends IInteraction, Document {
  _id: Types.ObjectId
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true }, // question(view, upvote, downvote, answer) / answer(answer, upvote, downvote, view)
    actionType: { type: String, enum: ['question', 'answer'], required: true },
  },
  {
    timestamps: true,
  }
)

const Interaction =
  (models.Interaction as Model<IInteraction>) ||
  model<IInteraction>('Interaction', InteractionSchema)

export default Interaction
