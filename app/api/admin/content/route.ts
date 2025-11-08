import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getContentCollection } from "@/models/Content";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const key = req.nextUrl.searchParams.get("key") || undefined;
  const col = await getContentCollection();
  if (key) {
    const doc = await col.findOne({ key });
    return NextResponse.json(doc ? { ...doc, _id: doc._id!.toString() } : null);
  }
  const list = await col.find({}).limit(200).toArray();
  return NextResponse.json(list.map((x) => ({ ...x, _id: x._id!.toString() })));
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const key = body?.key as string;
  if (!key) return NextResponse.json({ message: "key required" }, { status: 400 });
  const col = await getContentCollection();
  const now = new Date();
  await col.updateOne(
    { key },
    { $set: { title: body?.title || "", body: body?.body || "", data: body?.data || {}, updatedAt: now } },
    { upsert: true }
  );
  return NextResponse.json({ ok: true });
}


