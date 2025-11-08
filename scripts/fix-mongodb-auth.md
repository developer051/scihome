# วิธีแก้ไขปัญหา MongoDB Authentication

## สถานการณ์ปัจจุบัน
- MongoDB server ทำงานอยู่ที่ port 27017
- MongoDB เปิดใช้งาน authentication (`--auth`)
- Connection string มี password ที่มีอักขระพิเศษ (`%#`)

## วิธีแก้ไข

### วิธีที่ 1: แก้ไข password ใน .env.local

Password ปัจจุบัน: `bYir2l%#7nGFq1CuSpRy`

ต้อง encode อักขระพิเศษ:
- `%` → `%25`
- `#` → `%23`

ดังนั้น password ที่ถูกต้องควรเป็น: `bYir2l%25%237nGFq1CuSpRy`

แก้ไขไฟล์ `.env.local`:
```bash
MONGODB_URI=mongodb://root:bYir2l%25%237nGFq1CuSpRy@localhost:27017/sciencehome
```

### วิธีที่ 2: เปลี่ยน password ใน MongoDB

1. เชื่อมต่อ MongoDB โดยไม่ใช้ authentication (ถ้าเป็นไปได้):
```bash
docker exec -it <mongodb-container> mongosh
```

2. หรือถ้าเข้าถึงได้โดยตรง:
```bash
mongosh mongodb://localhost:27017
```

3. สร้าง user ใหม่หรือเปลี่ยน password:
```javascript
use admin
db.createUser({
  user: "root",
  pwd: "newpassword123",  // ใช้ password ที่ไม่มีอักขระพิเศษ
  roles: [ { role: "root", db: "admin" } ]
})
```

4. อัปเดต `.env.local`:
```bash
MONGODB_URI=mongodb://root:newpassword123@localhost:27017/sciencehome
```

### วิธีที่ 3: ใช้ authentication database ที่ถูกต้อง

ถ้า user ถูกสร้างใน database อื่น (ไม่ใช่ admin) ให้ระบุ authSource:

```bash
MONGODB_URI=mongodb://root:password@localhost:27017/sciencehome?authSource=admin
```

## ตรวจสอบการเชื่อมต่อ

รันสคริปต์ทดสอบ:
```bash
node scripts/test-mongodb.js
```

## หมายเหตุ

โค้ดใน `lib/mongodb.ts` จะ encode password อัตโนมัติแล้ว แต่ถ้า password ใน .env.local ถูก encode ไว้แล้ว อาจเกิดปัญหา double encoding

แนะนำให้:
1. ใช้ password ที่ไม่มีอักขระพิเศษ หรือ
2. Encode password ใน .env.local ไว้ก่อน (เช่น `%25` แทน `%`, `%23` แทน `#`)

