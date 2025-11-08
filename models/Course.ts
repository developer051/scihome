import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface Course {
  _id?: ObjectId;
  title: string;
  description?: string;
  category?: string; // หมวดหมู่คอร์ส เช่น "Generative AI", "Storage", "Compute"
  tutorIds?: ObjectId[];
  price?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCoursesCollection(): Promise<Collection<Course>> {
  const db = await getDb();
  return db.collection<Course>("courses");
}


