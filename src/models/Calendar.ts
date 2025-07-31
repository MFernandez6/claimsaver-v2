import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["appointment", "deadline", "follow-up", "payment", "custom"],
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Calendar ||
  mongoose.model("Calendar", CalendarSchema);
