import mongoose from "mongoose";

const counties = ["USA", "Canada", "UK", "Australia", "New Zealand", "Other"];

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    surname: String,
    created: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      validate: {
        validator: function (value: string) {
          return value.includes("@");
        },
        message: "Email must include '@'",
      },
    },
    facebook: {
      type: String,
      validate: {
        validator: function (value: string) {
          return value.startsWith("https://www.facebook.com/");
        },
        message: "Facebook must start with 'https://www.facebook.com/'",
      },
    },
  },
  { timestamps: true },
);

const fundationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      validate: {
        validator: function (value: string) {
          return value.includes("Foundation");
        },
        message: "Name must include 'Foundation'",
      },
      required: true,
      unique: true,
      index: true,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
        validate: {
          validator: function (value: string) {
            return counties.includes(value);
          },
          message:
            "Country must be one of the following: " + counties.join(", "),
        },
      },
    },
    created: {
      type: Date,
      default: Date.now,
    },
    volunteers: {
      type: [volunteerSchema],
      default: [],
    },
  },
  {
    methods: {
      getRandVolunteer() {
        const randomIndex = Math.floor(Math.random() * this.volunteers.length);

        return this.volunteers[randomIndex] || null;
      },
    },
  },
);

export const FoundationModel = mongoose.model<typeof fundationSchema>(
  "Fundation",
  fundationSchema,
);
