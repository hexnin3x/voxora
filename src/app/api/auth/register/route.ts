import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // 🛡️ RATE LIMITING: 3 registration requests per 1 minute
    const limiter = rateLimit(req, { limit: 3, windowMs: 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { message: `Too many registration attempts. Please try again in ${limiter.reset} seconds.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(limiter.reset),
          },
        }
      );
    }

    await connectDB();

    // ✅ Disable registration if a user account already exists
    const userExists = await User.findOne();
    if (userExists) {
      return NextResponse.json(
        { message: "Registrations are closed. Only one user account is allowed." },
        { status: 403 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // ✅ VALIDATION WITH ZOD
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
