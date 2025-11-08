import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStudentsCollection } from "@/models/Student";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const col = await getStudentsCollection();
  const list = await col
    .find({}, { projection: { fullName: 1, nickname: 1, isActive: 1 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
  return NextResponse.json(list.map((x) => ({ ...x, _id: x._id!.toString() })));
}


