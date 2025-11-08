import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined;
}

let uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "sciencehome";

if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

// แก้ไข URI หากมีอักขระพิเศษใน password ที่ไม่ได้ encode
// MongoDB connection string ต้อง encode password ที่มีอักขระพิเศษ
if (uri) {
  const uriMatch = uri.match(/^mongodb:\/\/([^:]+):([^@]+)@(.+)$/);
  if (uriMatch) {
    const [, username, password, rest] = uriMatch;
    // Encode password หากมีอักขระพิเศษ (เช่น %, #, @, :, /, ?)
    // แต่ต้องระวังไม่ให้ encode ซ้ำ (ถ้า encode แล้ว)
    try {
      // ลอง decode ก่อนเพื่อดูว่า encode แล้วหรือยัง
      const decoded = decodeURIComponent(password);
      // ถ้า decode แล้วได้ผลลัพธ์ต่างจากเดิม แสดงว่า encode แล้ว
      // แต่ถ้า password มีอักขระพิเศษที่ต้อง encode ให้ encode ใหม่
      const encodedPassword = encodeURIComponent(decoded);
      
      // เพิ่ม authSource=admin ถ้ายังไม่มี query parameters
      const hasQuery = rest.includes("?");
      const separator = hasQuery ? "&" : "?";
      const authSource = rest.includes("authSource") ? "" : `${separator}authSource=admin`;
      
      uri = `mongodb://${username}:${encodedPassword}@${rest}${authSource}`;
    } catch {
      // ถ้า decode ไม่ได้ แสดงว่า password อาจจะ encode แล้ว หรือมีรูปแบบพิเศษ
      // ในกรณีนี้ให้ใช้ password เดิม แต่เพิ่ม authSource
      const hasQuery = uri.includes("?");
      const separator = hasQuery ? "&" : "?";
      if (!uri.includes("authSource")) {
        uri = `${uri}${separator}authSource=admin`;
      }
    }
  } else {
    // ถ้าไม่มี authentication แต่มี query parameters ให้เพิ่ม authSource
    if (uri.includes("?") && !uri.includes("authSource")) {
      uri = `${uri}&authSource=admin`;
    } else if (!uri.includes("authSource")) {
      uri = `${uri}?authSource=admin`;
    }
  }
}

// ตรวจสอบว่า connection string มี authentication หรือไม่
if (uri && !uri.includes("@") && !uri.startsWith("mongodb://localhost") && !uri.startsWith("mongodb://127.0.0.1")) {
  console.warn("Warning: MONGODB_URI may be missing authentication credentials. Format should be: mongodb://username:password@host:port/database");
}

let client: MongoClient;

export async function getClient(): Promise<MongoClient> {
  if (global.__mongoClient) {
    // Test connection before returning cached client
    try {
      await global.__mongoClient.db("admin").command({ ping: 1 });
      return global.__mongoClient;
    } catch (error) {
      // Connection is stale, create a new one
      global.__mongoClient = undefined;
    }
  }

  client = new MongoClient(uri, {
    // Keep minimal options for compatibility
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  global.__mongoClient = client;
  return client;
}

export async function getDb(): Promise<Db> {
  const c = await getClient();
  return c.db(dbName);
}


