import { model, Schema, Types } from "mongoose";
import { Genders, OTP_TYPE, Providers, Roles } from "../../utils/enum/index.js";
import { getYearDifference } from "../../utils/time/index.js";
import { hash } from "../../utils/hash/hash.js";
import { decrypt } from "../../utils/crypto/decrypt.js";
import { encrypt } from "../../utils/crypto/encrypt.js";
import {
  defaultPublicId,
  defaultSecureUrl,
} from "../../utils/upload/defaults.js";
import { Company } from "./company.model.js";

// schema
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == Providers.SYSTEM;
      },
    },
    provider: {
      type: String,
      enum: [...Object.values(Providers)],
    },
    gender: {
      type: String,
      enum: [...Object.values(Genders)],
    },
    dob: {
      type: Date,
    },
    mobileNumber: String,
    role: {
      type: String,
      enum: [...Object.values(Roles)],
      default: Roles.USER,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: { type: Types.ObjectId, ref: "User" },
    changeCredentialTime: Date,
    profilePic: {
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
    otp: [
      {
        code: { type: String },
        otpType: { type: String },
        expiresIn: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// hash password on save
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hash(this.password);
    this.changeCredentialTime = Date.now();
  }
  return next();
});

// hash password || encrypt mobile number if updated || delete companies if user deleted
userSchema.pre("updateOne", async function (next) {
  // get query
  const update = this.getUpdate();

  if (update.mobileNumber) update.mobileNumber = encrypt(update.mobileNumber);

  if (update.deletedAt) {
    const filter = this.getFilter();
    await Company.updateMany(
      { createdBy: filter._id },
      { deletedAt: Date.now() }
    );
  }

  if (update.password) {
    update.password = hash(update.password);
    update.changeCredentialTime = Date.now();
  }
  return next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
  // get query
  const update = this.getUpdate();

  if (update.mobileNumber) update.mobileNumber = encrypt(update.mobileNumber);

  if (update.deletedAt) {
    const filter = this.getFilter();
    await Company.updateMany(
      { createdBy: filter._id },
      { deletedAt: Date.now() }
    );
  }

  if (update.password) {
    update.password = hash(update.password);
    update.changeCredentialTime = Date.now();
  }
  return next();
});

// decrypt mobile number when get user
userSchema.post("findOne", function (doc, next) {
  if (doc?.mobileNumber) doc.mobileNumber = decrypt(doc.mobileNumber);
  return next();
});
userSchema.post("findOneAndUpdate", function (doc, next) {
  if (doc?.mobileNumber) doc.mobileNumber = decrypt(doc.mobileNumber);
  return next();
});
userSchema.post("find", function (docs, next) {
  for (const doc of docs) {
    if (doc?.mobileNumber) doc.mobileNumber = decrypt(doc.mobileNumber);
  }
  return next();
});

userSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// model
export const User = model("User", userSchema);
