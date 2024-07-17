import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { MissionInterface } from "~/utils/types";

const missionSchema = new mongoose.Schema<MissionInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    missionType: {
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
    missionLocation: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "groups",
      required: false,
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
