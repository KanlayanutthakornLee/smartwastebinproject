# Smart Waste Bin Management System

ระบบจัดการถังขยะอัจฉริยะ (Smart Waste Bin) สำหรับติดตามสถานะถังขยะ จัดการประเภทขยะ และดูประวัติการเก็บขยะแบบเรียลไทม์ พัฒนาด้วย PHP และ MySQL

---

## 📖 ที่มาของโปรเจกต์ (Background)

โปรเจกต์นี้พัฒนาขึ้นเป็นส่วนหนึ่งของรายวิชา **Database Systems (ระบบฐานข้อมูล)** โดยมีจุดประสงค์เพื่อประยุกต์ใช้ความรู้ด้านการออกแบบและจัดการฐานข้อมูลเชิงสัมพันธ์ (Relational Database) 
กับสถานการณ์จริง ผ่านการสร้างระบบที่มีการจัดเก็บข้อมูลหลายตาราง มีความสัมพันธ์ระหว่างกัน และรองรับการอ่าน/เขียนข้อมูลผ่านเว็บแอปพลิเคชัน

แนวคิดของระบบ "ถังขยะอัจฉริยะ" ถูกเลือกเพราะเป็นปัญหาที่พบได้ในชีวิตประจำวัน และสามารถนำไปต่อยอดเป็นระบบ Smart City หรือใช้งานจริงในมหาวิทยาลัย/อาคารสำนักงานได้ในอนาคต

## 🎯 ปัญหาที่ต้องการแก้ (Problem Statement)

ปัจจุบันการจัดการขยะในพื้นที่ส่วนกลางยังพึ่งพาการตรวจสอบด้วยสายตาของพนักงานเป็นหลัก ทำให้เกิดปัญหาดังนี้:

| ปัญหา | ผลกระทบ |
|------|---------|
| ❌ **ไม่มีระบบติดตามสถานะถังขยะ** | ไม่ทราบว่าถังไหนเต็มแล้ว ทำให้ขยะล้นออกมานอกถัง |
| ❌ **เก็บขยะไม่ตรงเวลา / ไม่ตรงจุด** | บางถังเต็มล้น บางถังยังว่าง พนักงานต้องเดินตรวจทุกจุด |
| ❌ **ภาระงานของพนักงานเก็บขยะสูง** | ต้องเดินสำรวจถังทุกใบในทุกรอบ เสียเวลาและแรงงาน |
| ❌ **ต้นทุนการดำเนินงานสูง** | ใช้รถเก็บขยะวิ่งทุกรอบไม่ว่าถังจะเต็มหรือไม่ |
| ❌ **ไม่มีข้อมูลย้อนหลังสำหรับวางแผน** | ไม่ทราบจุดที่ขยะเต็มเร็ว ทำให้วางแผนเส้นทาง/ความถี่ในการเก็บได้ไม่ดี |

### 💡 แนวทางแก้ปัญหาของระบบ

ระบบ Smart Waste Bin ที่พัฒนาขึ้นช่วยแก้ปัญหาข้างต้นโดย:

- **ติดตามสถานะถังขยะแบบเรียลไทม์** — บันทึกระดับขยะ (fill level) และระดับแก๊ส (gas level) ของถังแต่ละใบ ทำให้รู้ทันทีว่าถังไหนเต็ม
- **ลดภาระพนักงาน** — พนักงานไม่ต้องเดินตรวจทุกถัง แต่ดูจาก Dashboard และไปเก็บเฉพาะถังที่เต็มแล้ว
- **ประหยัดต้นทุน** — วางแผนเส้นทางเก็บขยะได้อย่างมีประสิทธิภาพ ลดจำนวนรอบที่ไม่จำเป็น
- **เก็บประวัติการเก็บขยะ** — บันทึกว่าใครเก็บถังไหนเมื่อไหร่ ใช้ตรวจสอบและวิเคราะห์ภายหลังได้
- **บริหารจัดการประเภทขยะ** — แยกตามประเภท (ทั่วไป / รีไซเคิล / อันตราย ฯลฯ) ทำให้คัดแยกขยะได้ถูกต้อง

---

## ✨ คุณสมบัติ (Features)

- 🔐 ระบบล็อกอิน/ล็อกเอาต์สำหรับผู้ใช้งาน
- 🗑️ จัดการถังขยะ (เพิ่ม/แก้ไข/ลบ)
- 📍 จัดการตำแหน่งที่ตั้งของถังขยะ
- ♻️ จัดการประเภทขยะ
- 📊 ดูสถานะถังขยะแบบเรียลไทม์ (fill level, gas level)
- 📜 ดูประวัติการเก็บขยะ
- 👥 จัดการผู้ใช้งานในระบบ (พร้อมระบบ role)
- 📈 รายงานและสถิติ

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Backend:** PHP
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript

---

## 🗄️ การออกแบบฐานข้อมูล (Database Design)

### ER Diagram

ระบบประกอบด้วย 7 ตารางหลัก ที่มีความสัมพันธ์ระหว่างกันดังภาพ:

<img width="1763" height="838" alt="image" src="https://github.com/user-attachments/assets/75ddab19-9e65-4266-971d-699eaaff2f43" />


**สรุปความสัมพันธ์ของตาราง:**

- `users` มี `role` (M:1 → `roles`) — กำหนดสิทธิ์ของผู้ใช้
- `bins` ตั้งอยู่ที่ `location` (M:1 → `locations`) และมี `waste_type` (M:1 → `waste_types`)
- `bin_status` บันทึกสถานะของ `bins` ตามช่วงเวลา (M:1 → `bins`)
- `collection_history` บันทึกประวัติการเก็บขยะ — เชื่อมกับ `bins` (ถังไหน) และ `users` (ใครเก็บ)

### 📋 Data Dictionary

#### 🔹 `roles` — บทบาทของผู้ใช้งาน

| Column | Data Type | Key | Description |
|--------|-----------|-----|-------------|
| `role_id` | INT (AUTO_INCREMENT) | 🔑 PK | รหัสบทบาท |
| `role_name` | VARCHAR | | ชื่อบทบาท เช่น admin, staff, collector |

#### 🔹 `users` — ผู้ใช้งานในระบบ

| Column | Data Type | Key | Description |
|--------|-----------|-----|-------------|
| `user_id` | INT (AUTO_INCREMENT) | 🔑 PK | รหัสผู้ใช้ |
| `user_name` | VARCHAR | | ชื่อ-นามสกุลของผู้ใช้ |
| `username` | VARCHAR (UNIQUE) | | ชื่อสำหรับเข้าสู่ระบบ |
| `password_hash` | VARCHAR | | รหัสผ่าน (เก็บแบบ hashed เพื่อความปลอดภัย) |
| `role_id` | INT | 🔗 FK → `roles.role_id` | บทบาทของผู้ใช้ |

#### 🔹 `locations` — ตำแหน่งที่ตั้งของถังขยะ

| Column | Data Type | Key | Description |
|--------|-----------|-----|-------------|
| `location_id` | INT (AUTO_INCREMENT) | 🔑 PK | รหัสตำแหน่ง |
| `location_name` | VARCHAR | | ชื่อตำแหน่ง เช่น "หน้าตึก A", "โรงอาหาร" |
| `zone` | VARCHAR | | โซน/พื้นที่ เช่น "อาคารวิศวะ", "ลานกีฬา" |

#### 🔹 `waste_types` — ประเภทขยะ

| Column | Data Type | Key | Description |
|--------|-----------|-----|-------------|
| `waste_type_id` | INT (AUTO_INCREMENT) | 🔑 PK | รหัสประเภทขยะ |
| `type_name` | VARCHAR | | ชื่อประเภท เช่น ทั่วไป, รีไซเคิล, อันตราย, เศษอาหาร |

#### 🔹 `bins` — ถังขยะ

| Column | Data Type | Key | Description |
|--------|-----------|-----|-------------|
| `bin_id` | INT (AUTO_INCREMENT) | 🔑 PK | รหัสถังขยะ |
| `location_id` | INT | 🔗 FK → `locations.location_id` | ตำแหน่งที่ตั้งถัง |
| `waste_type_id` | INT | 🔗 FK → `waste_types.waste_type_id` | ประเภทขยะที่รองรับ |
| `capacity` | INT | | ความจุของถัง (เช่น เป็นลิตร) |

#### 🔹 `bin_status` — สถานะถังขยะ ณ ช่วงเวลาต่างๆ

| Column | Data Type | Key | Description |
|--------|-----------|-----|-------------|
| `status_id` | INT (AUTO_INCREMENT) | 🔑 PK | รหัสบันทึกสถานะ |
| `bin_id` | INT | 🔗 FK → `bins.bin_id` | ถังที่ถูกบันทึกสถานะ |
| `timestamp` | DATETIME | | วันเวลาที่บันทึก |
| `fill_level` | FLOAT | | ระดับขยะในถัง (เช่น 0.0–100.0%) |
| `gas_level` | FLOAT | | ระดับแก๊ส/กลิ่นในถัง |

#### 🔹 `collection_history` — ประวัติการเก็บขยะ

| Column | Data Type | Key | Description |
|--------|-----------|-----|-------------|
| `collection_id` | INT (AUTO_INCREMENT) | 🔑 PK | รหัสการเก็บขยะ |
| `bin_id` | INT | 🔗 FK → `bins.bin_id` | ถังที่ถูกเก็บ |
| `collected_by` | INT | 🔗 FK → `users.user_id` | ผู้ใช้ที่ทำการเก็บ |
| `collection_time` | DATETIME | | วันเวลาที่เก็บขยะ |

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```
smartwastebin/
├── backend/
│   ├── auth/           # ระบบล็อกอิน/ล็อกเอาต์
│   ├── bins/           # จัดการถังขยะ
│   ├── config/         # ตั้งค่าฐานข้อมูล
│   ├── history/        # ประวัติการเก็บขยะ
│   ├── locations/      # จัดการตำแหน่ง
│   ├── status/         # อัพเดทสถานะ
│   ├── users/          # จัดการผู้ใช้งาน
│   └── waste_types/    # จัดการประเภทขยะ
├── database/
│   └── smartwastebin.sql   # ไฟล์ฐานข้อมูล
├── frontend/
│   ├── assets/
│   │   ├── css/        # ไฟล์ CSS
│   │   └── js/         # ไฟล์ JavaScript
│   ├── includes/       # Header, Footer, Sidebar
│   ├── bins.php
│   ├── dashboard.php
│   ├── history.php
│   ├── locations.php
│   ├── login.php
│   ├── report.php
│   ├── status.php
│   ├── users.php
│   └── waste_types.php
└── index.php
```

## ⚙️ การติดตั้ง (Installation)

### ความต้องการของระบบ (Requirements)

- PHP 7.4 ขึ้นไป
- MySQL 5.7 ขึ้นไป

### ขั้นตอนการติดตั้ง

1. **โคลนโปรเจกต์**
   ```bash
   git clone https://github.com/KanlayanutthakornLee/smartwastebinproject.git
   ```

2. **ย้ายไฟล์ไปยังโฟลเดอร์ของ Web Server**
   - สำหรับ XAMPP: ย้ายไปที่ `C:\xampp\htdocs\`
   - สำหรับ WAMP: ย้ายไปที่ `C:\wamp64\www\`

3. **เปิด MySQL**

4. **สร้างฐานข้อมูล**
   - เปิด phpMyAdmin: `http://localhost/phpmyadmin`
   - สร้างฐานข้อมูลใหม่ชื่อ `smartwastebin`
   - นำเข้าไฟล์ `database/smartwastebin.sql`

5. **ตั้งค่าการเชื่อมต่อฐานข้อมูล**
   - เปิดไฟล์ `backend/config/db.php`
   - แก้ไขข้อมูลเชื่อมต่อให้ตรงกับเครื่องของคุณ
   ```php
   $host = "localhost";
   $username = "root";
   $password = "";
   $database = "smartwastebin";
   ```

6. **เปิดใช้งาน**
   - เข้าใช้งานผ่าน: `http://localhost/smartwastebin/`

## 🚀 การใช้งาน (Usage)

1. เข้าสู่ระบบผ่านหน้า Login
<img width="1891" height="893" alt="image" src="https://github.com/user-attachments/assets/b2645323-5c91-4ca2-b144-f0b180fbf848" />

2. ไปที่ Dashboard เพื่อดูภาพรวมของระบบ
<img width="1879" height="900" alt="image" src="https://github.com/user-attachments/assets/ee8598db-6aaf-467f-ba10-df0aa49fd168" />

3. จัดการข้อมูลต่างๆ ผ่านเมนูด้านข้าง:
   - เพิ่ม/แก้ไข/ลบ ถังขยะ
   <img width="1896" height="902" alt="image" src="https://github.com/user-attachments/assets/7636345d-65b2-440d-af73-59c2d4791bbe" />

   - กำหนดตำแหน่งและประเภทขยะ
   <img width="1892" height="899" alt="image" src="https://github.com/user-attachments/assets/25b38644-f681-4201-8bd0-2433db3c3e03" />
   <img width="1894" height="899" alt="image" src="https://github.com/user-attachments/assets/37190478-63a7-4a68-bf27-4510b31845a2" />

   - ติดตามสถานะและประวัติการเก็บขยะ
   <img width="1897" height="898" alt="image" src="https://github.com/user-attachments/assets/b3b306a6-0e41-4305-91da-d3b3b98e0306" />

## 🤝 การมีส่วนร่วม (Contributing)

หากต้องการพัฒนาเพิ่มเติม สามารถทำได้โดย:

1. Fork โปรเจกต์นี้
2. สร้าง branch ใหม่ (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📝 License

โปรเจกต์นี้พัฒนาเพื่อการศึกษา (รายวิชา Database Systems)

## 👨‍💻 ผู้พัฒนา (Authors)

- **สรวิชญ์ อาจหาร** 67117317
- **ภูวนัย แก้วสีดา** 67117348
- **กัลยนัฏฐกรณ์ ลำน้อย** 67168812
- **กษิดิ์เดช คงยิ่งยศ** 67122412
- **ณัฐภูมิ จุลละรุจิ** 67117420

GitHub: [@KanlayanutthakornLee](https://github.com/KanlayanutthakornLee)

---
