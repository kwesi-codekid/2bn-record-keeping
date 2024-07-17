import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { MissionInterface } from "~/utils/types";

const missionSchema = new mongoose.Schema<MissionInterface>(
  {
    inCharge: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
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
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
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

let Mission: mongoose.Model<MissionInterface>;
try {
  Mission = mongoose.model<MissionInterface>("missions");
} catch (error) {
  Mission = mongoose.model<MissionInterface>("missions", missionSchema);
}

export default Mission;
