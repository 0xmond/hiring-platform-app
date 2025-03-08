import { model, Schema, Types } from "mongoose";
import { Status } from "../../utils/enum/index.js";

// schema
const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      required: true,
      ref: "Job",
    },
    applierId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    userCV: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: [...Object.values(Status)],
      required: true,
      default: Status.PENDING,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// model
export const Application = model("Application", applicationSchema);
