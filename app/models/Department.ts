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
    commandingOfficer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    departmentSeargent: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    platoonCommander: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    administrationWarranty: {
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
