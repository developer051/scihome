import { NextRequest, NextResponse } from "next/server";
import { getCoursesCollection } from "@/models/Course";

// Public API สำหรับดึงคอร์สที่แสดงในหน้าแรก (แสดงเฉพาะคอร์สที่ isActive = true)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = parseInt(searchParams.get("skip") || "0");
    
    const col = await getCoursesCollection();
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    
    const [list, total] = await Promise.all([
      col.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments(query),
    ]);
    
    return NextResponse.json({
      courses: list.map((x) => ({ ...x, _id: x._id!.toString() })),
      total,
      skip,
      limit,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ courses: [], total: 0, skip: 0, limit: 0 }, { status: 500 });
  }
}

