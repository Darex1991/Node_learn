import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
    published: {
      type: Boolean,
      default: false,
    },
    image: String,
    category: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    ratings: [
      {
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    methods: {
      getAverageRating() {
        if (!this.ratings.length) {
          return 0;
        }
        const sum = this.ratings.reduce(
          (acc, rating) => acc + rating.rating,
          0,
        );
        return Math.round(sum / this.ratings.length);
      },
    },
  },
);

export const Game = mongoose.model("Game", gameSchema);
