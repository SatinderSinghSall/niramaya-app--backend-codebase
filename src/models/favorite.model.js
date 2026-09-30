import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    itemType: {
      type: String,
      enum: ["ayurveda", "yoga"],
      required: true,
      index: true,
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

favoriteSchema.index(
  {
    user: 1,
    itemType: 1,
    item: 1,
  },
  {
    unique: true,
  },
);

favoriteSchema.index({
  user: 1,
  itemType: 1,
  createdAt: -1,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
