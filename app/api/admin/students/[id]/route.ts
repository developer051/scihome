import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStudentsCollection } from "@/models/Student";
import { ObjectId } from "mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const col = await getStudentsCollection();
  const doc = await col.findOne({ _id: new ObjectId(params.id) });
  if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ ...doc, _id: doc._id!.toString() });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const action = body?.action as string;
  const col = await getStudentsCollection();
  const _id = new ObjectId(params.id);

  if (action === "toggleActive") {
    const doc = await col.findOne({ _id });
    if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const updated = await col.updateOne({ _id }, { $set: { isActive: !doc.isActive, updatedAt: new Date() } });
    return NextResponse.json({ ok: updated.modifiedCount === 1 });
  }

  return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
}


