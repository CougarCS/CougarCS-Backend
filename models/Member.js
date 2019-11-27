import { model, Schema } from 'mongoose';

const MemberSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  PSID: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
  },
  profileImageData: {
    profileImage: {
      type: String,
      required: true,
    },
    profileImageKey: {
      type: String,
      required: true,
    },
  },
  resumeData: {
    resumeLink: {
      type: String,
      // required: true
    },
    resumeKey: {
      type: String,
      // required: true
    },
  },
  pointsData: {
    eventsAttend: [
      {
        eventName: { type: String },
        eventDate: { type: Date },
      },
    ],
    points: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  paymentDetails: {
    paidAmount: { type: Number, default: 0 },
    date: { type: Date },
  },
  isOfficer: {
    type: Boolean,
    required: true,
    default: false,
  },
  isEmployee: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model('member', MemberSchema);
