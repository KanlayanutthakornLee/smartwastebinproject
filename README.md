<img width="1891" height="893" alt="image" src="https://github.com/user-attachments/assets/e01c0064-c0fe-4d4e-943c-8813c8a58f6e" />Smart Waste Bin Management System

ระบบจัดการถังขยะอัจฉริยะ (Smart Waste Bin) สำหรับติดตามสถานะถังขยะ จัดการประเภทขยะ และดูประวัติการเก็บขยะแบบเรียลไทม์ พัฒนาด้วย PHP และ MySQL

## คุณสมบัติ (Features)

- 🔐 ระบบล็อกอิน/ล็อกเอาต์สำหรับผู้ใช้งาน
- 🗑️ จัดการถังขยะ (เพิ่ม/แก้ไข/ลบ)
- 📍 จัดการตำแหน่งที่ตั้งของถังขยะ
- ♻️ จัดการประเภทขยะ
- 📊 ดูสถานะถังขยะแบบเรียลไทม์
- 📜 ดูประวัติการเก็บขยะ
- 👥 จัดการผู้ใช้งานในระบบ
- 📈 รายงานและสถิติ

##  เทคโนโลยีที่ใช้ (Tech Stack)

- **Backend:** PHP
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript

##  โครงสร้างโปรเจกต์ (Project Structure)

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

##  การติดตั้ง (Installation)

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

3. **เปิด MySQL

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

## การใช้งาน (Usage)

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

โปรเจกต์นี้พัฒนาเพื่อการศึกษา

## 👨‍💻 ผู้พัฒนา (Author)

**สรวิชญ์ อาจหาร 67117317**
**ภูวนัย แก้วสีดา 67117348**
**กัลยนัฏฐกรณ์ ลำน้อย 67168812**
**กษิดิ์เดช คงยิ่งยศ 67122412**
**ณัฐภูมิ จุลละรุจิ 67117420**

- GitHub: [@KanlayanutthakornLee](https://github.com/KanlayanutthakornLee)

---
