# Requirements Document

## Introduction

AWS Flash Cards เป็นเว็บแอปพลิเคชันแบบ Single Page Application ที่ทำงานฝั่ง client ทั้งหมด สำหรับช่วยผู้เรียนจดจำ AWS Services เพื่อเตรียมสอบ AWS Certified Cloud Practitioner (CLF-C02) ระบบมีสองโหมดการเรียน คือ Flash Cards (การ์ดพลิกได้พร้อมการบันทึกว่าจำได้หรือยังไม่แม่น) และ Match Game (เกมจับคู่ชื่อ service กับคำอธิบาย) ข้อมูล AWS Services ถูกฝังไว้ใน source code แบบ static และความก้าวหน้าของผู้ใช้ถูกเก็บใน localStorage ของเบราว์เซอร์

เอกสารนี้ระบุความต้องการที่ได้จากเอกสารการออกแบบ (`design.md`) โดยครอบคลุมโครงสร้างข้อมูล การทำงานของทั้งสองโหมด การเก็บความก้าวหน้า การนำทาง การจัดการข้อผิดพลาด และแนวทางด้านส่วนติดต่อผู้ใช้

## Glossary

- **Flash_Card_System**: ส่วนของระบบที่จัดการ deck การ์ด การพลิกการ์ด การนำทาง และการบันทึกสถานะจำได้/ยังไม่แม่น (`useFlashCards` และ components ภายใต้ `components/flashcard/`)
- **Match_Game_System**: ส่วนของระบบที่จัดการเกมจับคู่ ตั้งแต่การสร้างกระดาน การตรวจคู่ การนับเวลาและจำนวนครั้ง จนถึงการสรุปผล (`useMatchGame` และ components ภายใต้ `components/match/`)
- **Progress_System**: ส่วนของระบบที่อ่านและเขียนความก้าวหน้าของผู้ใช้ลง localStorage และคำนวณสถิติ (`useProgress` และ `utils/storage.ts`)
- **Dataset**: ชุดข้อมูล AWS Services แบบ static ใน `src/data/awsServices.ts` ซึ่งมี 89 รายการ กระจายใน 10 หมวด
- **Service**: หนึ่งรายการใน Dataset ที่มีโครงสร้างตาม interface `AWSService`
- **Category**: หมวดของ Service หนึ่งใน 10 ค่า: Compute, Storage, Database, Networking, Security, Serverless, Management, AI/ML, Migration, Billing
- **Deck**: ลำดับการ์ดที่ผ่านการกรองตาม Category และโหมด แล้วสับลำดับ ใช้ในโหมด Flash Cards
- **Review_Mode**: โหมดของ Flash Cards ที่แสดงเฉพาะการ์ดที่ยังไม่ถูกบันทึกว่าจำได้
- **Match_Card**: การ์ดหนึ่งใบในกระดาน Match Game ที่มีชนิดเป็น `service` หรือ `description`
- **Pair**: คู่ของ Match_Card สองใบที่มี `pairId` เดียวกันและมีชนิดต่างกัน
- **Difficulty**: ระดับความยากของ Match Game หนึ่งใน `easy` (4 คู่), `medium` (6 คู่), `hard` (8 คู่)
- **Attempt**: การเปิด Match_Card ใบที่สองสำเร็จหนึ่งครั้ง ซึ่งทำให้เกิดการตรวจคู่
- **Progress_Store**: รายการใน localStorage ภายใต้ key `aws-flashcards-progress` ที่เก็บ JSON ของ `UserProgress`
- **Default_Progress**: ค่าเริ่มต้นของ `UserProgress` ที่ทุกตัวนับเป็นศูนย์และทุกลิสต์ว่าง
- **Streak**: จำนวนวันติดต่อกันที่ผู้ใช้เข้ามาเรียนในโหมด Flash Cards
- **Shuffle_Utility**: ฟังก์ชัน `shuffle` ใน `utils/shuffle.ts` ที่สับลำดับแบบ Fisher–Yates และคืน array ใหม่
- **Navigation_System**: ส่วนของระบบที่จัดการเส้นทาง URL ด้วย React Router v6 (`App.tsx`)

## Requirements

### Requirement 1: โครงสร้างโปรเจกต์และการรัน Development Server

**User Story:** As a ผู้พัฒนา, I want โครงสร้างโปรเจกต์ที่ตั้งค่าไว้พร้อมใช้, so that ผมสามารถรันแอปและพัฒนาต่อได้ทันทีโดยไม่ต้องตั้งค่าเพิ่ม

#### Acceptance Criteria

1. THE Dataset SHALL อยู่ในไฟล์ `src/data/awsServices.ts` และถูก import แบบ static โดยไม่มีการเรียก network
2. WHEN คำสั่ง `npm run dev` ถูกรัน THE Navigation_System SHALL ให้บริการแอปพลิเคชันที่พอร์ต 5173
3. THE Flash_Card_System SHALL วางไฟล์ตามโครงสร้างที่กำหนดใน design: `components/layout/`, `components/flashcard/`, `components/match/`, `components/ui/`, `data/`, `hooks/`, `pages/`, `types/`, `utils/`
4. THE Navigation_System SHALL คอมไพล์ผ่าน TypeScript ในโหมด strict โดยไม่มี type error
5. WHEN แอปพลิเคชันถูกโหลดในเบราว์เซอร์ THE Navigation_System SHALL แสดงหน้าจอโดยไม่มีข้อความ error ใน console

### Requirement 2: ชุดข้อมูล AWS Services

**User Story:** As a ผู้เรียน, I want ข้อมูล AWS Services ที่ครบถ้วนและถูกจัดหมวด, so that ผมทบทวนเนื้อหาที่ออกสอบ CLF-C02 ได้ครบทุกหัวข้อ

#### Acceptance Criteria

1. THE Dataset SHALL มี Service จำนวน 89 รายการ
2. THE Dataset SHALL มีจำนวน Service ต่อ Category ดังนี้: Compute 10, Storage 7, Database 8, Networking 12, Security 15, Serverless 5, Management 8, AI/ML 11, Migration 3, Billing 10
3. THE Dataset SHALL กำหนดให้ทุก Service มีค่า `id` ที่ไม่ซ้ำกับรายการอื่นและตรงรูปแบบ kebab-case `^[a-z0-9-]+$`
4. THE Dataset SHALL กำหนดให้ทุก Service มีค่าที่ไม่ใช่สตริงว่างในฟิลด์ `name`, `fullName`, `description`, `answer` และ `hint`
5. THE Dataset SHALL กำหนดให้ทุก Service มีค่า `category` ที่เป็นหนึ่งใน 10 ค่าของ Category
6. THE Dataset SHALL ให้เนื้อหาในฟิลด์ `description`, `answer` และ `hint` เป็นภาษาไทยที่ใช้ศัพท์เทคนิคภาษาอังกฤษกำกับ
7. WHERE Service มีจุดที่มักออกสอบ CLF-C02 THE Dataset SHALL ระบุค่าในฟิลด์ `examTips`

### Requirement 3: การสับลำดับการ์ด

**User Story:** As a ผู้เรียน, I want ลำดับการ์ดที่สุ่มใหม่ได้, so that ผมไม่จำเนื้อหาจากลำดับแต่จำจากตัวเนื้อหา

#### Acceptance Criteria

1. WHEN Shuffle_Utility ถูกเรียกด้วยรายการใด ๆ THE Shuffle_Utility SHALL คืนรายการใหม่ที่มีความยาวเท่ากับรายการที่รับเข้ามา
2. WHEN Shuffle_Utility ถูกเรียกด้วยรายการใด ๆ THE Shuffle_Utility SHALL คืนรายการที่มีสมาชิกเป็นชุดเดียวกับรายการที่รับเข้ามาทั้งจำนวนและค่าของแต่ละสมาชิก
3. WHEN Shuffle_Utility ถูกเรียก THE Shuffle_Utility SHALL คงรายการที่รับเข้ามาไว้ในสภาพเดิมโดยไม่แก้ไข
4. WHERE มีการส่งฟังก์ชันสุ่มตัวเลขเข้ามาเป็นพารามิเตอร์ THE Shuffle_Utility SHALL ใช้ฟังก์ชันนั้นในการกำหนดลำดับผลลัพธ์
5. WHEN ผู้ใช้กดปุ่มสุ่มใหม่ THE Flash_Card_System SHALL สร้าง Deck ใหม่ด้วย Shuffle_Utility และตั้งตำแหน่งการ์ดปัจจุบันเป็นใบแรก

### Requirement 4: การกรองการ์ดตามหมวด

**User Story:** As a ผู้เรียน, I want เลือกทบทวนเฉพาะหมวดที่ต้องการ, so that ผมโฟกัสหัวข้อที่ยังอ่อนได้

#### Acceptance Criteria

1. THE Flash_Card_System SHALL แสดงปุ่มเลือกหมวดครบทั้ง 10 Category พร้อมปุ่มเลือก "ทั้งหมด"
2. THE Flash_Card_System SHALL แสดงจำนวน Service ที่อยู่ในแต่ละ Category กำกับบนปุ่มของหมวดนั้น
3. WHEN ผู้ใช้เลือก Category หนึ่ง THE Flash_Card_System SHALL สร้าง Deck ที่มีเฉพาะ Service ที่มี `category` ตรงกับที่เลือก
4. WHEN ผู้ใช้เลือก Category หนึ่ง THE Flash_Card_System SHALL รวม Service ทุกรายการของหมวดนั้นไว้ใน Deck
5. WHEN ผู้ใช้เลือก "ทั้งหมด" THE Flash_Card_System SHALL สร้าง Deck จาก Service ทุกรายการใน Dataset
6. WHEN Deck ถูกสร้างใหม่จากการเปลี่ยน Category THE Flash_Card_System SHALL ตั้งสถานะการพลิกการ์ดเป็นด้านหน้า

### Requirement 5: การแสดงและพลิกการ์ด

**User Story:** As a ผู้เรียน, I want พลิกการ์ดเพื่อดูคำตอบ, so that ผมทดสอบความจำตัวเองก่อนเห็นเฉลย

#### Acceptance Criteria

1. WHILE การ์ดอยู่ด้านหน้า THE Flash_Card_System SHALL แสดง `name`, `fullName` และป้ายกำกับ Category ของ Service นั้น
2. WHEN ผู้ใช้คลิกที่การ์ด THE Flash_Card_System SHALL สลับสถานะการพลิกของการ์ดใบนั้น
3. WHILE การ์ดอยู่ด้านหลัง THE Flash_Card_System SHALL แสดงค่า `answer` และ `hint` ของ Service นั้น
4. WHERE Service มีค่า `examTips` AND การ์ดอยู่ด้านหลัง THE Flash_Card_System SHALL แสดงค่า `examTips`
5. IF Service ไม่มีค่า `examTips` THEN THE Flash_Card_System SHALL แสดงด้านหลังการ์ดโดยไม่มีส่วน Exam Tips
6. WHEN การ์ดถูกพลิก THE Flash_Card_System SHALL แสดงการเคลื่อนไหวแบบหมุนสามมิติรอบแกนตั้งด้วยระยะเวลา 0.4 วินาที
7. THE Flash_Card_System SHALL ให้การ์ดรับโฟกัสด้วยคีย์บอร์ดได้และสื่อสถานะการพลิกผ่านคุณสมบัติ ARIA

### Requirement 6: การบันทึกสถานะจำได้และยังไม่แม่น

**User Story:** As a ผู้เรียน, I want ทำเครื่องหมายว่าการ์ดใบไหนจำได้แล้ว, so that ผมติดตามได้ว่าเหลืออะไรต้องทบทวน

#### Acceptance Criteria

1. WHEN ผู้ใช้กดปุ่ม "จำได้" บนการ์ดปัจจุบัน THE Flash_Card_System SHALL เพิ่ม `id` ของ Service นั้นในรายการจำได้และนำออกจากรายการยังไม่แม่น
2. WHEN ผู้ใช้กดปุ่ม "ยังไม่แม่น" บนการ์ดปัจจุบัน THE Flash_Card_System SHALL เพิ่ม `id` ของ Service นั้นในรายการยังไม่แม่นและนำออกจากรายการจำได้
3. THE Flash_Card_System SHALL คงให้รายการจำได้และรายการยังไม่แม่นไม่มีสมาชิกร่วมกัน
4. THE Flash_Card_System SHALL คงให้รายการจำได้และรายการยังไม่แม่นไม่มีสมาชิกซ้ำภายในรายการเดียวกัน
5. WHEN ผู้ใช้ทำเครื่องหมายเดิมซ้ำบน Service เดียวกัน THE Flash_Card_System SHALL คงสถานะให้เท่ากับผลของการทำเครื่องหมายครั้งเดียว
6. WHEN ผู้ใช้ทำเครื่องหมายจำได้หรือยังไม่แม่น THE Flash_Card_System SHALL เลื่อนไปการ์ดถัดไปและตั้งสถานะการพลิกเป็นด้านหน้า
7. WHEN ผู้ใช้ทำเครื่องหมายจำได้หรือยังไม่แม่น THE Progress_System SHALL บันทึกความก้าวหน้าลง Progress_Store
8. WHEN ผู้ใช้กดปุ่ม "ข้าม" THE Flash_Card_System SHALL เลื่อนไปการ์ดถัดไปโดยไม่เปลี่ยนรายการจำได้และรายการยังไม่แม่น

### Requirement 7: การนำทางระหว่างการ์ด

**User Story:** As a ผู้เรียน, I want เลื่อนไปการ์ดก่อนหน้าและถัดไปได้, so that ผมย้อนกลับไปดูการ์ดที่เพิ่งผ่านได้

#### Acceptance Criteria

1. WHEN ผู้ใช้สั่งเลื่อนไปการ์ดถัดไป AND การ์ดปัจจุบันเป็นใบสุดท้าย THE Flash_Card_System SHALL แสดงการ์ดใบแรกของ Deck
2. WHEN ผู้ใช้สั่งเลื่อนไปการ์ดก่อนหน้า AND การ์ดปัจจุบันเป็นใบแรก THE Flash_Card_System SHALL แสดงการ์ดใบสุดท้ายของ Deck
3. THE Flash_Card_System SHALL คงให้ตำแหน่งการ์ดปัจจุบันอยู่ในช่วงตั้งแต่ 0 ถึงจำนวนการ์ดใน Deck ลบหนึ่ง
4. WHEN ตำแหน่งการ์ดปัจจุบันเปลี่ยน THE Flash_Card_System SHALL ตั้งสถานะการพลิกเป็นด้านหน้า
5. IF Deck ไม่มีการ์ดเหลืออยู่ THEN THE Flash_Card_System SHALL แสดงข้อความสถานะว่างภาษาไทยพร้อมปุ่มดูการ์ดทั้งหมด และปิดการใช้งานปุ่มควบคุมการ์ด

### Requirement 8: โหมดทบทวนเฉพาะการ์ดที่ยังไม่แม่น

**User Story:** As a ผู้เรียน, I want ทบทวนเฉพาะการ์ดที่ยังไม่แม่น, so that ผมใช้เวลากับสิ่งที่ยังไม่รู้

#### Acceptance Criteria

1. WHEN ผู้ใช้เข้าสู่ Review_Mode THE Flash_Card_System SHALL สร้าง Deck ที่ไม่มี Service ซึ่ง `id` ปรากฏในรายการจำได้ของ Progress_Store
2. WHILE อยู่ใน Review_Mode AND มีการเลือก Category THE Flash_Card_System SHALL สร้าง Deck ที่ทั้งอยู่ในหมวดที่เลือกและยังไม่ถูกบันทึกว่าจำได้
3. IF Review_Mode ทำให้ไม่มีการ์ดเหลือ THEN THE Flash_Card_System SHALL แสดงข้อความสถานะว่างและปุ่มออกจาก Review_Mode
4. WHEN ผู้ใช้กดปุ่มสุ่มทั้งหมด THE Flash_Card_System SHALL ล้างรายการจำได้และรายการยังไม่แม่นของเซสชันปัจจุบันและสร้าง Deck ใหม่จาก Service ทุกรายการที่ผ่านการกรองหมวด

### Requirement 9: การแสดงความก้าวหน้าในโหมด Flash Cards

**User Story:** As a ผู้เรียน, I want เห็นความก้าวหน้าระหว่างทบทวน, so that ผมรู้ว่าเหลืออีกเท่าไร

#### Acceptance Criteria

1. THE Flash_Card_System SHALL แสดงแถบความก้าวหน้าที่สะท้อนสัดส่วนของการ์ดที่ทำเครื่องหมายแล้วต่อจำนวนการ์ดทั้งหมดใน Deck
2. THE Flash_Card_System SHALL แสดงจำนวนการ์ดที่จำได้ จำนวนการ์ดที่ยังไม่แม่น และจำนวนการ์ดที่เหลือ
3. WHEN รายการจำได้หรือรายการยังไม่แม่นเปลี่ยนแปลง THE Flash_Card_System SHALL ปรับค่าที่แสดงในแถบความก้าวหน้าและสถิติให้ตรงกับสถานะใหม่

### Requirement 10: คีย์บอร์ดช็อตคัตในโหมด Flash Cards

**User Story:** As a ผู้เรียน, I want ควบคุมการ์ดด้วยคีย์บอร์ด, so that ผมทบทวนได้เร็วขึ้น

#### Acceptance Criteria

1. WHEN ผู้ใช้กดปุ่ม Space THE Flash_Card_System SHALL สลับสถานะการพลิกของการ์ดปัจจุบัน
2. WHEN ผู้ใช้กดปุ่มลูกศรซ้าย THE Flash_Card_System SHALL ทำเครื่องหมายการ์ดปัจจุบันว่ายังไม่แม่น
3. WHEN ผู้ใช้กดปุ่มลูกศรขวา THE Flash_Card_System SHALL ทำเครื่องหมายการ์ดปัจจุบันว่าจำได้
4. WHEN ผู้ใช้กดปุ่มลูกศรขึ้น THE Flash_Card_System SHALL แสดงการ์ดก่อนหน้า
5. WHEN ผู้ใช้กดปุ่มลูกศรลง THE Flash_Card_System SHALL แสดงการ์ดถัดไป
6. WHEN ผู้ใช้กดปุ่มตัวอักษร S THE Flash_Card_System SHALL สร้าง Deck ใหม่ด้วย Shuffle_Utility
7. THE Flash_Card_System SHALL ให้ผลลัพธ์ของคีย์บอร์ดช็อตคัตแต่ละปุ่มเท่ากับผลลัพธ์ของการกดปุ่มควบคุมที่สอดคล้องกัน
8. WHEN ผู้ใช้ออกจากหน้าโหมด Flash Cards THE Flash_Card_System SHALL ถอดตัวรับเหตุการณ์คีย์บอร์ดออก

### Requirement 11: การสร้างกระดาน Match Game

**User Story:** As a ผู้เรียน, I want เริ่มเกมจับคู่ตามระดับความยากที่เลือก, so that ผมฝึกจำแบบสนุกและปรับความท้าทายได้

#### Acceptance Criteria

1. THE Match_Game_System SHALL ให้ผู้ใช้เลือก Difficulty จากสามระดับ: easy, medium และ hard
2. THE Match_Game_System SHALL สร้างกระดานที่มีจำนวน Pair เท่ากับ 4 สำหรับ easy, 6 สำหรับ medium และ 8 สำหรับ hard
3. WHEN กระดานถูกสร้าง THE Match_Game_System SHALL สร้าง Match_Card จำนวนเท่ากับจำนวน Pair คูณสอง
4. WHEN กระดานถูกสร้าง THE Match_Game_System SHALL สร้าง Match_Card ชนิด `service` ที่มีเนื้อหาเป็น `name` และ Match_Card ชนิด `description` ที่มีเนื้อหาเป็น `description` สำหรับ Service ที่ถูกสุ่มแต่ละรายการ
5. WHEN กระดานถูกสร้าง THE Match_Game_System SHALL เลือก Service ที่ไม่ซ้ำกันภายในกระดานเดียว
6. WHEN กระดานถูกสร้าง THE Match_Game_System SHALL สับตำแหน่งของ Match_Card ทุกใบด้วย Shuffle_Utility
7. WHEN กระดานถูกสร้าง THE Match_Game_System SHALL ตั้งให้ Match_Card ทุกใบอยู่ในสถานะคว่ำและยังไม่จับคู่
8. WHERE ผู้ใช้ระบุ Category ก่อนเริ่มเกม AND หมวดนั้นมี Service มากกว่าหรือเท่ากับจำนวน Pair ที่ต้องการ THE Match_Game_System SHALL เลือก Service จากหมวดนั้นเท่านั้น
9. IF Category ที่ผู้ใช้เลือกมี Service น้อยกว่าจำนวน Pair ที่ต้องการ THEN THE Match_Game_System SHALL สุ่ม Service จากทุกหมวดและแสดงข้อความแจ้งผู้ใช้ว่าหมวดนั้นมีการ์ดไม่พอ
10. WHEN เกมเริ่ม THE Match_Game_System SHALL บันทึกเวลาเริ่มต้นและเริ่มแสดงเวลาที่ผ่านไป

### Requirement 12: การเปิดการ์ดและตรวจการจับคู่

**User Story:** As a ผู้เรียน, I want เปิดการ์ดสองใบเพื่อจับคู่, so that ผมเชื่อมโยงชื่อ service กับหน้าที่ของมันได้

#### Acceptance Criteria

1. WHEN ผู้ใช้คลิก Match_Card ที่คว่ำอยู่ AND มีการ์ดเปิดอยู่น้อยกว่าสองใบ THE Match_Game_System SHALL หงายการ์ดใบนั้น
2. WHEN มีการ์ดเปิดอยู่สองใบ THE Match_Game_System SHALL เพิ่มจำนวน Attempt ขึ้นหนึ่ง
3. WHEN Match_Card สองใบที่เปิดมี `pairId` เดียวกันและมีชนิดต่างกัน THE Match_Game_System SHALL ทำเครื่องหมายทั้งสองใบว่าจับคู่แล้ว เปิดค้างไว้ และแสดงกรอบสีเขียว
4. IF Match_Card สองใบที่เปิดไม่ใช่ Pair เดียวกัน THEN THE Match_Game_System SHALL คว่ำการ์ดทั้งสองใบกลับหลังจากผ่านไป 1 วินาที
5. WHILE รอการคว่ำการ์ดที่ไม่ตรงกัน THE Match_Game_System SHALL ปฏิเสธการคลิกการ์ดใบอื่น
6. IF ผู้ใช้คลิก Match_Card ที่จับคู่แล้ว THEN THE Match_Game_System SHALL คงสถานะกระดานไว้เดิม
7. IF ผู้ใช้คลิก Match_Card ใบที่เปิดอยู่แล้ว THEN THE Match_Game_System SHALL คงสถานะกระดานไว้เดิมและไม่เพิ่มจำนวน Attempt
8. THE Match_Game_System SHALL คงให้ Match_Card ที่จับคู่แล้วอยู่ในสถานะจับคู่แล้วตลอดเกม
9. THE Match_Game_System SHALL คงให้จำนวนการ์ดที่เปิดอยู่ไม่เกินสองใบ
10. THE Match_Game_System SHALL คงให้รายการ Pair ที่จับคู่แล้วไม่มีสมาชิกซ้ำ
11. THE Match_Game_System SHALL คงให้ผลรวมของจำนวน Pair ที่จับคู่แล้วคูณสองบวกจำนวนการ์ดที่เปิดอยู่ ไม่เกินจำนวนการ์ดทั้งหมดบนกระดาน

### Requirement 13: การจบเกมและการให้คะแนน

**User Story:** As a ผู้เรียน, I want เห็นผลสรุปเมื่อเล่นจบ, so that ผมรู้ว่าทำได้ดีแค่ไหนและอยากทำให้ดีขึ้น

#### Acceptance Criteria

1. WHEN จำนวน Pair ที่จับคู่แล้วเท่ากับจำนวน Pair ทั้งหมดบนกระดาน THE Match_Game_System SHALL ตั้งสถานะเกมเป็นจบและหยุดการนับเวลา
2. THE Match_Game_System SHALL ตั้งสถานะเกมเป็นจบเฉพาะเมื่อจำนวน Pair ที่จับคู่แล้วเท่ากับจำนวน Pair ทั้งหมดบนกระดาน
3. WHEN เกมจบ THE Match_Game_System SHALL แสดงเวลาที่ใช้เป็นวินาที จำนวน Attempt และจำนวนดาวที่ได้
4. WHEN จำนวน Attempt น้อยกว่าหรือเท่ากับจำนวน Pair บวกสอง THE Match_Game_System SHALL ให้คะแนนสามดาว
5. WHEN จำนวน Attempt มากกว่าจำนวน Pair บวกสอง AND น้อยกว่าหรือเท่ากับจำนวน Pair คูณสอง THE Match_Game_System SHALL ให้คะแนนสองดาว
6. WHEN จำนวน Attempt มากกว่าจำนวน Pair คูณสอง THE Match_Game_System SHALL ให้คะแนนหนึ่งดาว
7. THE Match_Game_System SHALL ให้จำนวนดาวที่ได้ไม่เพิ่มขึ้นเมื่อจำนวน Attempt เพิ่มขึ้นที่จำนวน Pair เดิม
8. WHEN เกมจบ THE Match_Game_System SHALL แสดงสถิติที่ดีที่สุดของ Difficulty นั้นทั้งเวลาและจำนวน Attempt
9. WHEN เกมจบ THE Match_Game_System SHALL แสดงปุ่มเล่นอีกครั้งและปุ่มกลับหน้าแรก

### Requirement 14: การนับเวลาในเกม

**User Story:** As a ผู้เรียน, I want เห็นเวลาที่ใช้ระหว่างเล่น, so that ผมรู้ว่าตัวเองเร็วขึ้นหรือไม่

#### Acceptance Criteria

1. WHILE เกมกำลังดำเนินอยู่ THE Match_Game_System SHALL แสดงเวลาที่ผ่านไปโดยปรับค่าทุก 1 วินาที
2. THE Match_Game_System SHALL คำนวณเวลาที่ผ่านไปจากผลต่างระหว่างเวลาปัจจุบันกับเวลาเริ่มต้นของเกม
3. WHEN เกมจบหรือผู้ใช้ออกจากหน้าเกม THE Match_Game_System SHALL หยุดตัวจับเวลาและคืนทรัพยากรที่ใช้
4. WHILE เกมยังไม่เริ่ม THE Match_Game_System SHALL แสดงเวลาเป็นศูนย์

### Requirement 15: การเก็บและอ่านความก้าวหน้า

**User Story:** As a ผู้เรียน, I want ให้ระบบจำความก้าวหน้าของผม, so that ผมกลับมาเรียนต่อจากที่ค้างไว้ได้

#### Acceptance Criteria

1. THE Progress_System SHALL เก็บความก้าวหน้าใน Progress_Store ภายใต้ key `aws-flashcards-progress` เป็นข้อมูล JSON ตามโครงสร้าง `UserProgress`
2. WHEN Progress_System บันทึกความก้าวหน้าแล้วอ่านกลับ THE Progress_System SHALL คืนข้อมูลที่เทียบเท่ากับข้อมูลที่บันทึกไป
3. WHEN แอปพลิเคชันเริ่มทำงาน THE Progress_System SHALL อ่านความก้าวหน้าจาก Progress_Store และนำมาใช้เป็นสถานะเริ่มต้น
4. IF Progress_Store ไม่มีข้อมูลอยู่ THEN THE Progress_System SHALL ใช้ Default_Progress
5. IF ข้อมูลใน Progress_Store แปลงเป็น JSON ไม่ได้ THEN THE Progress_System SHALL ใช้ Default_Progress และดำเนินการต่อโดยไม่หยุดทำงาน
6. IF ข้อมูลใน Progress_Store มีโครงสร้างไม่ตรงกับ `UserProgress` THEN THE Progress_System SHALL เติมค่าที่ขาดจาก Default_Progress
7. THE Progress_System SHALL คืนข้อมูลที่มีโครงสร้างตรงตาม `UserProgress` ทุกครั้งที่อ่านความก้าวหน้า
8. IF Progress_Store มี `id` ที่ไม่ปรากฏใน Dataset THEN THE Progress_System SHALL นำ `id` นั้นออกจากรายการจำได้และรายการยังไม่แม่น
9. IF การเขียนลง Progress_Store ล้มเหลว THEN THE Progress_System SHALL คงสถานะในหน่วยความจำไว้และให้แอปพลิเคชันทำงานต่อได้

### Requirement 16: สถิติที่ดีที่สุดของ Match Game

**User Story:** As a ผู้เรียน, I want ให้ระบบเก็บสถิติที่ดีที่สุดของผม, so that ผมมีเป้าหมายที่จะทำให้ดีขึ้น

#### Acceptance Criteria

1. WHEN เกมจบ THE Progress_System SHALL เพิ่มจำนวนเกมที่เล่นแล้วขึ้นหนึ่ง
2. WHEN เกมจบ AND เวลาที่ใช้น้อยกว่าเวลาที่ดีที่สุดของ Difficulty นั้น THE Progress_System SHALL บันทึกเวลาที่ใช้เป็นเวลาที่ดีที่สุดใหม่
3. WHEN เกมจบ AND ยังไม่มีเวลาที่ดีที่สุดของ Difficulty นั้น THE Progress_System SHALL บันทึกเวลาที่ใช้เป็นเวลาที่ดีที่สุด
4. WHEN เกมจบ AND จำนวน Attempt น้อยกว่าจำนวน Attempt ที่ดีที่สุดของ Difficulty นั้น THE Progress_System SHALL บันทึกจำนวน Attempt นั้นเป็นสถิติที่ดีที่สุดใหม่
5. THE Progress_System SHALL คงให้เวลาที่ดีที่สุดและจำนวน Attempt ที่ดีที่สุดของแต่ละ Difficulty ไม่เพิ่มขึ้นจากค่าที่บันทึกไว้ก่อนหน้า
6. WHEN บันทึกผลของ Difficulty หนึ่ง THE Progress_System SHALL คงค่าสถิติของ Difficulty อื่นไว้เดิม
7. WHEN เกมจบ THE Progress_System SHALL บันทึกวันที่เล่นล่าสุดเป็นวันที่ปัจจุบันในรูปแบบ `YYYY-MM-DD`

### Requirement 17: การนับวันเรียนติดต่อกัน

**User Story:** As a ผู้เรียน, I want เห็นจำนวนวันที่เรียนติดต่อกัน, so that ผมมีแรงจูงใจเรียนสม่ำเสมอ

#### Acceptance Criteria

1. WHEN ผู้ใช้เรียนในวันเดียวกับวันที่เรียนล่าสุด THE Progress_System SHALL คงค่า Streak ไว้เท่าเดิม
2. WHEN ผู้ใช้เรียนในวันถัดจากวันที่เรียนล่าสุดพอดีหนึ่งวัน THE Progress_System SHALL เพิ่มค่า Streak ขึ้นหนึ่ง
3. IF วันที่ปัจจุบันห่างจากวันที่เรียนล่าสุดมากกว่าหนึ่งวัน THEN THE Progress_System SHALL ตั้งค่า Streak เป็นหนึ่ง
4. IF ยังไม่มีวันที่เรียนล่าสุดบันทึกไว้ THEN THE Progress_System SHALL ตั้งค่า Streak เป็นหนึ่งเมื่อผู้ใช้เรียนครั้งแรก
5. WHEN ผู้ใช้เรียนในวันใด THE Progress_System SHALL ให้ค่า Streak ที่ได้มีค่าอย่างน้อยหนึ่ง
6. WHEN ผู้ใช้ทำเครื่องหมายการ์ด THE Progress_System SHALL บันทึกวันที่เรียนล่าสุดเป็นวันที่ปัจจุบันในรูปแบบ `YYYY-MM-DD`

### Requirement 18: หน้าแรกและการเลือกโหมด

**User Story:** As a ผู้เรียน, I want เห็นภาพรวมและเลือกโหมดจากหน้าแรก, so that ผมเริ่มเรียนได้เร็วที่สุด

#### Acceptance Criteria

1. THE Navigation_System SHALL แสดงหน้าแรกที่มีตัวเลือกสองโหมด: Flash Cards และ Match Game
2. THE Navigation_System SHALL แสดงจำนวน Service ที่ผู้ใช้ทำเครื่องหมายว่าจำได้เทียบกับจำนวน Service ทั้งหมดใน Dataset
3. THE Navigation_System SHALL แสดงค่า Streak ปัจจุบันและจำนวนเกมที่เล่นแล้ว
4. THE Navigation_System SHALL แสดงเวลาที่ดีที่สุดและจำนวน Attempt ที่ดีที่สุดของแต่ละ Difficulty
5. WHERE Progress_Store มีความก้าวหน้าของโหมด Flash Cards อยู่แล้ว THE Navigation_System SHALL แสดงปุ่มเรียนต่อจากคราวที่แล้วซึ่งเปิดโหมด Flash Cards ในสถานะ Review_Mode
6. IF ยังไม่มีความก้าวหน้าบันทึกไว้ THEN THE Navigation_System SHALL แสดงค่าสถิติเป็นศูนย์

### Requirement 19: การนำทางด้วย URL

**User Story:** As a ผู้เรียน, I want เข้าถึงแต่ละโหมดผ่าน URL ได้โดยตรง, so that ผมบุ๊กมาร์กโหมดที่ใช้บ่อยได้

#### Acceptance Criteria

1. WHEN ผู้ใช้เข้าเส้นทาง `/` THE Navigation_System SHALL แสดงหน้าแรก
2. WHEN ผู้ใช้เข้าเส้นทาง `/flashcards` THE Navigation_System SHALL แสดงหน้าโหมด Flash Cards
3. WHEN ผู้ใช้เข้าเส้นทาง `/match` THE Navigation_System SHALL แสดงหน้าโหมด Match Game
4. IF ผู้ใช้เข้าเส้นทางที่ไม่มีอยู่ THEN THE Navigation_System SHALL นำผู้ใช้ไปที่หน้าแรก
5. THE Navigation_System SHALL แสดงแถบส่วนหัวที่มีลิงก์ไปทั้งสามเส้นทางในทุกหน้า
6. THE Navigation_System SHALL ทำเครื่องหมายลิงก์ของเส้นทางที่กำลังแสดงอยู่ให้ต่างจากลิงก์อื่น

### Requirement 20: ส่วนติดต่อผู้ใช้และการเข้าถึง

**User Story:** As a ผู้เรียน, I want หน้าจอที่อ่านง่ายและใช้งานได้ทั้งบนเดสก์ท็อปและแท็บเล็ต, so that ผมทบทวนได้ทุกที่

#### Acceptance Criteria

1. THE Navigation_System SHALL แสดงข้อความส่วนติดต่อผู้ใช้ทั้งหมดเป็นภาษาไทย
2. THE Navigation_System SHALL ใช้ชุดสีหลักที่มีสีส้ม `orange-500` เป็นสีหลัก สีน้ำเงินม่วง `indigo-600` เป็นสีรอง และพื้นหลัง `slate-50`
3. THE Flash_Card_System SHALL แสดงป้ายกำกับ Category ด้วยสีประจำหมวดตามที่กำหนดในเอกสารการออกแบบ
4. THE Match_Game_System SHALL แสดงกระดานเป็นตารางที่ปรับจำนวนคอลัมน์ระหว่างสองถึงสี่คอลัมน์ตามความกว้างของหน้าจอ
5. THE Match_Game_System SHALL แสดงด้านคว่ำของ Match_Card เป็นพื้นสีเทาพร้อมเครื่องหมายคำถาม ด้านหงายชนิด `service` เป็นพื้นสีน้ำเงินพร้อมชื่อตัวหนา และด้านหงายชนิด `description` เป็นพื้นสีม่วงพร้อมข้อความคำอธิบาย
6. WHEN Match_Card ถูกจับคู่ THE Match_Game_System SHALL แสดงการเคลื่อนไหวขยายขนาดพร้อมกรอบเรืองแสงสีเขียว
7. THE Navigation_System SHALL ใช้ธีมสีสว่างเพียงธีมเดียว
8. THE Navigation_System SHALL กำหนดคำอธิบายสำหรับเทคโนโลยีช่วยเหลือเป็นภาษาไทยบนปุ่มควบคุมทุกปุ่ม
9. THE Navigation_System SHALL แสดงกรอบโฟกัสที่มองเห็นได้ชัดบนองค์ประกอบที่รับโฟกัสด้วยคีย์บอร์ด
10. THE Navigation_System SHALL แสดงเนื้อหาทั้งหมดเป็นข้อความธรรมดาโดยไม่แปลผลเป็น HTML
