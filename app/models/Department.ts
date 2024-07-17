import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { DepartmentInterface } from "~/utils/types";

const schema = new Schema<DepartmentInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    strength: {
      type: String,
    },
    mission: {
      type: String,
    },
    vission: {
      type: String,
    },
    quote: {
      type: String,
    },
    tacticOfficer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    trainingOfficer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

let Department: mongoose.Model<DepartmentInterface>;
try {
  Department = mongoose.model<DepartmentInterface>("departments");
} catch (error) {
  Department = mongoose.model<DepartmentInterface>("departments", schema);
}

export default Department;
