import mongoose, { Schema } from 'mongoose';

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

FaqSchema.index({ question: 'text', answer: 'text' });

export default mongoose.models.Faq || mongoose.model('Faq', FaqSchema);
