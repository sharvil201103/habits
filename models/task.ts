import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  label: string;
  coins: number;
  deadline: Date;
  completed: boolean;
  repeated: boolean;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    label: { type: String, required: true },
    coins: { type: Number, required: true },
    deadline: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    repeated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
