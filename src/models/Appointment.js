import db from '../db';


export const appointmentSchema = db.Schema({
  tutor: {
    type: db.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  learner: {
    type: db.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
    default: 'proposed',
    enum: [
      'proposed',
      'approved',
      'rejected',
    ],
  },

  subject: {
    type: String,
    required: true,
  },

  cost: Number,

  charge: String,
});

appointmentSchema.methods.toJSON = function () {
  const appointment = this.toObject();
  delete appointment.__v;
  return appointment;
};

export default db.model('Appointment', appointmentSchema);
