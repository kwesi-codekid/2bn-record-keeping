import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { CompanyInterface } from "~/utils/types";

const schema = new Schema<CompanyInterface>(
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
    CompanySeargent: {
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

let Company: mongoose.Model<CompanyInterface>;
try {
  Company = mongoose.model<CompanyInterface>("companys");
} catch (error) {
  Company = mongoose.model<CompanyInterface>("companys", schema);
}

export default Company;
