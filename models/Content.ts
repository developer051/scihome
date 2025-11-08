import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface ContentBlock {
  _id?: ObjectId;
  key: string; // e.g., "aboutus", "homepage_hero"
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  updatedBy?: ObjectId;
  updatedAt: Date;
}

export async function getContentCollection(): Promise<Collection<ContentBlock>> {
  const db = await getDb();
  return db.collection<ContentBlock>("content");
}


