import mongoose, { Schema } from 'mongoose';

const QuerySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Solved'], default: 'Pending' },
    adminReply: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Query || mongoose.model('Query', QuerySchema);
