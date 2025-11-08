import { NextRequest, NextResponse } from "next/server";
import { getStudentsCollection } from "@/models/Student";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      nickname,
      school,
      educationLevel,
      interestedCourses = [],
      interestedCareerPath,
    } = body ?? {};

    if (!fullName || typeof fullName !== "string") {
      return NextResponse.json({ message: "fullName is required" }, { status: 400 });
    }

    const now = new Date();
    const doc = {
      fullName,
      nickname: nickname || "",
      school: school || "",
      educationLevel: educationLevel || "",
      interestedCourses: Array.isArray(interestedCourses)
        ? interestedCourses
        : typeof interestedCourses === "string"
        ? interestedCourses.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      interestedCareerPath: interestedCareerPath || "",
      isActive: true,
      enrolledCourses: [],
      createdAt: now,
      updatedAt: now,
    };

    const students = await getStudentsCollection();
    const result = await students.insertOne(doc as any);
    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}


