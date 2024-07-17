import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { GroupInterface } from "~/utils/types";

const schema = new Schema<GroupInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    inCharge: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Group: mongoose.Model<GroupInterface>;
try {
  Group = mongoose.model<GroupInterface>("groups");
} catch (error) {
  Group = mongoose.model<GroupInterface>("groups", schema);
}

export default Group;
