import db from '../db';

export const reviewSchema = db.Schema({
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

    userRating: [{
    reviewedName: {type: String, default: ''},
    reviewerFullname: {type: String, default: ''},
    userRating: {type: Number, default: 0},
    userReview: {type: String, default: ''}
  }],
    
  ratingNumber: [Number],
  ratingSum: {type: Number, default: 0},

  });

reviewSchema.methods.toJSON = function () {
  const review = this.toObject();
  delete review.__v;
  return review;
};

export default db.model('Review', reviewSchema);