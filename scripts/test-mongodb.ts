import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { resolve } from "path";

// โหลด environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "sciencehome";

async function testConnection() {
  console.log("🔍 กำลังตรวจสอบการเชื่อมต่อ MongoDB...\n");

  if (!uri) {
    console.error("❌ MONGODB_URI ไม่ได้ถูกตั้งค่าใน environment variables");
    process.exit(1);
  }

  // แสดง connection string โดยซ่อน password
  const maskedUri = uri.replace(/:([^:@]+)@/, ":****@");
  console.log(`📋 Connection String: ${maskedUri}`);
  console.log(`📋 Database Name: ${dbName}\n`);

  let client: MongoClient | null = null;

  try {
    // 1. ทดสอบการเชื่อมต่อ
    console.log("1️⃣ กำลังเชื่อมต่อกับ MongoDB server...");
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    await client.connect();
    console.log("✅ เชื่อมต่อสำเร็จ!\n");

    // 2. ทดสอบ authentication
    console.log("2️⃣ กำลังทดสอบ authentication...");
    const adminDb = client.db("admin");
    const pingResult = await adminDb.command({ ping: 1 });
    console.log("✅ Authentication สำเร็จ!");
    console.log(`   Ping result: ${JSON.stringify(pingResult)}\n`);

    // 3. ทดสอบการเข้าถึง database
    console.log(`3️⃣ กำลังทดสอบการเข้าถึง database: ${dbName}...`);
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(`✅ เข้าถึง database สำเร็จ!`);
    console.log(`   พบ collections: ${collections.length} รายการ`);
    if (collections.length > 0) {
      console.log(`   Collections: ${collections.map((c) => c.name).join(", ")}\n`);
    } else {
      console.log(`   (ยังไม่มี collections)\n`);
    }

    // 4. ทดสอบการอ่านข้อมูลจาก collection content
    console.log("4️⃣ กำลังทดสอบการอ่านข้อมูลจาก collection 'content'...");
    const contentCollection = db.collection("content");
    const contentCount = await contentCollection.countDocuments();
    console.log(`✅ อ่านข้อมูลสำเร็จ!`);
    console.log(`   จำนวน documents ใน collection 'content': ${contentCount}\n`);

    // 5. ทดสอบการ query ข้อมูลที่ใช้ในหน้าแรก
    console.log("5️⃣ กำลังทดสอบการ query ข้อมูล news section cards...");
    const [card1, card2, card3] = await Promise.all([
      contentCollection.findOne({ key: "news_section_card_1" }),
      contentCollection.findOne({ key: "news_section_card_2" }),
      contentCollection.findOne({ key: "news_section_card_3" }),
    ]);
    console.log("✅ Query สำเร็จ!");
    console.log(`   news_section_card_1: ${card1 ? "พบ" : "ไม่พบ"}`);
    console.log(`   news_section_card_2: ${card2 ? "พบ" : "ไม่พบ"}`);
    console.log(`   news_section_card_3: ${card3 ? "พบ" : "ไม่พบ"}\n`);

    // 6. แสดงข้อมูล server
    console.log("6️⃣ ข้อมูล MongoDB Server:");
    const serverStatus = await adminDb.command({ serverStatus: 1 });
    console.log(`   Version: ${serverStatus.version || "N/A"}`);
    console.log(`   Uptime: ${serverStatus.uptime ? Math.floor(serverStatus.uptime / 60) + " นาที" : "N/A"}\n`);

    console.log("🎉 การทดสอบทั้งหมดสำเร็จ! MongoDB พร้อมใช้งาน\n");
  } catch (error: any) {
    console.error("\n❌ เกิดข้อผิดพลาด:\n");
    
    if (error.message?.includes("authentication")) {
      console.error("   🔐 ปัญหา Authentication:");
      console.error("      - ตรวจสอบว่า username และ password ถูกต้อง");
      console.error("      - ตรวจสอบว่า user มีสิทธิ์เข้าถึง database");
      console.error(`      - Error: ${error.message}\n`);
    } else if (error.message?.includes("ECONNREFUSED") || error.message?.includes("connect")) {
      console.error("   🔌 ปัญหา Connection:");
      console.error("      - ตรวจสอบว่า MongoDB server ทำงานอยู่");
      console.error("      - ตรวจสอบว่า host และ port ถูกต้อง");
      console.error(`      - Error: ${error.message}\n`);
    } else if (error.message?.includes("timeout")) {
      console.error("   ⏱️  ปัญหา Timeout:");
      console.error("      - MongoDB server อาจไม่ตอบสนอง");
      console.error("      - ตรวจสอบ network connection");
      console.error(`      - Error: ${error.message}\n`);
    } else {
      console.error(`   Error: ${error.message || error}\n`);
      if (error.stack) {
        console.error("   Stack trace:");
        console.error(error.stack.split("\n").slice(0, 5).join("\n"));
      }
    }
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("🔌 ปิดการเชื่อมต่อแล้ว");
    }
  }
}

testConnection();

