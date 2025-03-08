import { model, Schema, Types } from "mongoose";
import { EmployeesCount } from "../../utils/enum/index.js";
import {
  defaultPublicId,
  defaultSecureUrl,
} from "../../utils/upload/defaults.js";
import { Job } from "./job.model.js";

// schema
const companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
    },
    description: String,
    industry: String,
    address: String,
    numberOfEmployees: {
      type: String,
      enum: EmployeesCount,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    logo: {
      public_id: {
        type: String,
        default: defaultPublicId,
      },
      secure_url: {
        type: String,
        default: defaultSecureUrl,
      },
    },
    coverPic: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    HRs: {
      type: [Types.ObjectId],
      ref: "User",
    },
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// if company deleted, soft delete related jobs
companySchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();

  if (update.deletedAt) {
    const filter = this.getFilter();
    await Job.updateMany({ companyId: filter._id }, { deletedAt: Date.now() });
  }

  return next();
});

// if companies deleted, soft delete related jobs
companySchema.pre("updateMany", async function (next) {
  const update = this.getUpdate();
  const filter = this.getFilter();

  if (update.deletedAt && filter.createdBy) {
    await Job.updateMany(
      { addedBy: filter.createdBy },
      { deletedAt: Date.now() }
    );
  }

  return next();
});

companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});

// model
export const Company = model("Company", companySchema);
