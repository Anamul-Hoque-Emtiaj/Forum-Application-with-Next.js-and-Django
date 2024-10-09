// app/api/auth/signup/route.js

import { hash } from "bcryptjs";
import prisma from "@/lib/prisma"; // Adjust the import path as needed
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, email, password } = await request.json();

  // Validate input
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  // Hash password
  const hashedPassword = await hash(password, 12);

  // Create new user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
