import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { DutyInterface } from "~/utils/types";

const dutySchema = new mongoose.Schema<DutyInterface>(
  {
    officer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    dutyType: {
      type: String,
      required: true,
      enum: [
        "patrol",
        "traffic",
        "investigation",
        "community service",
        "administrative",
      ],
      trim: true,
    },
    dutyLocation: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "sngoing", "sompleted", "sancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

let Duty: mongoose.Model<DutyInterface>;
try {
  Duty = mongoose.model<DutyInterface>("duties");
} catch (error) {
  Duty = mongoose.model<DutyInterface>("duties", dutySchema);
}

export default Duty;
