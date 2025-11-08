import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCoursesCollection } from "@/models/Course";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const col = await getCoursesCollection();
  const list = await col.find({}).sort({ createdAt: -1 }).limit(200).toArray();
  return NextResponse.json(list.map((x) => ({ ...x, _id: x._id!.toString() })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const title = body?.title as string;
  if (!title) return NextResponse.json({ message: "title required" }, { status: 400 });
  const now = new Date();
  const col = await getCoursesCollection();
  const result = await col.insertOne({ 
    title, 
    description: body?.description || "", 
    category: body?.category || "",
    price: body?.price || undefined,
    isActive: body?.isActive !== undefined ? body.isActive : true, 
    createdAt: now, 
    updatedAt: now 
  } as any);
  return NextResponse.json({ _id: result.insertedId.toString() }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const _id = body?._id as string;
  if (!_id) return NextResponse.json({ message: "_id required" }, { status: 400 });
  const col = await getCoursesCollection();
  const now = new Date();
  const updateData: any = {
    updatedAt: now,
  };
  if (body?.title !== undefined) updateData.title = body.title;
  if (body?.description !== undefined) updateData.description = body.description;
  if (body?.category !== undefined) updateData.category = body.category;
  if (body?.price !== undefined) updateData.price = body.price;
  if (body?.isActive !== undefined) updateData.isActive = body.isActive;
  
  await col.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");
  if (!_id) return NextResponse.json({ message: "_id required" }, { status: 400 });
  const col = await getCoursesCollection();
  await col.deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ ok: true });
}


