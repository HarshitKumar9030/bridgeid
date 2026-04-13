import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: "Email is already in use." }, { status: 409 });
      }
      if (existingUser.username === username) {
        return NextResponse.json({ message: "Username is already taken." }, { status: 409 });
      }
    }

    // Hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully.", user: { username: newUser.username, email: newUser.email } }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the user." },
      { status: 500 }
    );
  }
}
