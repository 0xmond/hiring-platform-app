import { model, Schema, Types } from "mongoose";
import {
  JobLocations,
  SeniorityLevels,
  WorkingTimes,
} from "../../utils/enum/index.js";
import { Application } from "./application.model.js";

// schema
const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: [...Object.values(JobLocations)],
    },
    workingTime: {
      type: String,
      enum: [...Object.values(WorkingTimes)],
    },
    seniorityLevel: {
      type: String,
      enum: [...Object.values(SeniorityLevels)],
    },
    jobDescription: { type: String, required: true },
    technicalSkills: { type: [String], required: true },
    softSkills: [String],
    addedBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Types.ObjectId,
      required: true,
      ref: "Company",
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

// if job deleted, soft delete related applications
jobSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();

  if (update.deletedAt) {
    const filter = this.getFilter();
    await Application.updateMany(
      { jobId: filter._id },
      { deletedAt: Date.now() }
    );
  }

  return next();
});

jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

// model
export const Job = model("Job", jobSchema);
