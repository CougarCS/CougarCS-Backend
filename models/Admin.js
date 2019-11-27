import { model, Schema } from 'mongoose';

const AdminSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model('admin', AdminSchema);
