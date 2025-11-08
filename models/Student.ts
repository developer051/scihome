import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type EducationLevel =
  | "ประถม"
  | "มัธยมต้น"
  | "มัธยมปลาย"
  | "มหาวิทยาลัย"
  | "อื่นๆ"
  | string;

export interface Student {
  _id?: ObjectId;
  fullName: string;
  nickname?: string;
  school?: string;
  educationLevel?: EducationLevel;
  interestedCourses?: string[];
  interestedCareerPath?: string;
  isActive: boolean;
  enrolledCourses: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getStudentsCollection(): Promise<Collection<Student>> {
  const db = await getDb();
  return db.collection<Student>("students");
}


