import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: [Types.ObjectId],
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const chatSchema = new Schema(
  {
    users: {
      type: [Types.ObjectId],
      ref: "User",
      required: true,
    },
    message: [messageSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Chat = model("Chat", chatSchema);
