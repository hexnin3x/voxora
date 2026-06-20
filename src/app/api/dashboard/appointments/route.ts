import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // 🔐 Get token from HTTP-only cookie
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔐 Verify token
    verifyToken(token);

    // Parse URL query params
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(1000, parseInt(searchParams.get("limit") || "1000", 10)));

    await connectDB();

    // Query appointments sorted by date (latest first)
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return Response.json({
      appointments,
    });
  } catch (error) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}
