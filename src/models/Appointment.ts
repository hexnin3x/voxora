import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    trackingCode: {
      type: String,
      required: [true, "Tracking code is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
      trim: true,
    },
    cost: {
      type: String,
      default: "$400",
      trim: true,
    },
  },
  { timestamps: true }
);

AppointmentSchema.index({ trackingCode: 1 });

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
