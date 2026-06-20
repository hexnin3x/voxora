import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
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
    const decoded = verifyToken(token);

    // Parse URL pagination query params
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    await connectDB();

    // Query contacts with skip/limit pagination, and fetch total count
    const [contacts, total] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(),
    ]);

    return Response.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}
