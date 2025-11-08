import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTutorsCollection } from "@/models/Tutor";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const col = await getTutorsCollection();
  const list = await col.find({}).sort({ createdAt: -1 }).limit(200).toArray();
  return NextResponse.json(list.map((x) => ({ ...x, _id: x._id!.toString() })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = body?.name as string;
  if (!name) return NextResponse.json({ message: "name required" }, { status: 400 });
  const now = new Date();
  const col = await getTutorsCollection();
  const result = await col.insertOne({ name, bio: body?.bio || "", isActive: true, createdAt: now, updatedAt: now } as any);
  return NextResponse.json({ _id: result.insertedId.toString() }, { status: 201 });
}


