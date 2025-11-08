import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface Tutor {
  _id?: ObjectId;
  name: string;
  bio?: string;
  subjects?: string[];
  photoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTutorsCollection(): Promise<Collection<Tutor>> {
  const db = await getDb();
  return db.collection<Tutor>("tutors");
}


