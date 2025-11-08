import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface AdminUser {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

export async function getAdminsCollection(): Promise<Collection<AdminUser>> {
  const db = await getDb();
  return db.collection<AdminUser>("admins");
}


