import mongoose, { Schema } from 'mongoose';

const ChatMessageSchema = new Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [ChatMessageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.ChatHistory || mongoose.model('ChatHistory', ChatHistorySchema);
