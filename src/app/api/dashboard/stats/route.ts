import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Appointment from "@/models/Appointment";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    verifyToken(token);

    await connectDB();

    const [totalLeads, totalAppointments] = await Promise.all([
      Contact.countDocuments(),
      Appointment.countDocuments(),
    ]);

    return Response.json({ totalLeads, totalAppointments });
  } catch (err) {
    console.error("Stats API error:", err);
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
}
