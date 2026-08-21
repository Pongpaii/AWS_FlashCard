# AWS CLF-C02 Flash Cards & Match Game — Kiro Prompt (Full Build)

## Project Overview

- ชื่อ: AWS Flash Cards (เว็บฝึกจำ AWS Services สำหรับสอบ CLF-C02)
- โครงสร้าง: Single SPA (client-only, ไม่มี backend)
- Tech Stack: React 19 + TypeScript + Vite + Tailwind CSS
- Data: Static JSON embedded in source (ไม่ต้องมี API)
- Storage: localStorage สำหรับ progress tracking
- Port: 5173 (Vite default)
- ภาษาใน UI: ไทย, Code comments: อังกฤษ

## สิ่งที่ต้องสร้าง

### 1. Project Setup

- Vite + React 19 + TypeScript + Tailwind CSS
- `npm run dev` → start dev server
- โครงสร้าง folders:``` src/ ├── components/ │ ├── layout/ │ │ └── Header.tsx │ ├── flashcard/ │ │ ├── FlashCardDeck.tsx │ │ ├── FlashCard.tsx │ │ └── CategoryFilter.tsx │ ├── match/ │ │ ├── MatchGame.tsx │ │ ├── MatchCard.tsx │ │ └── MatchResult.tsx │ └── ui/ │ ├── ProgressBar.tsx

│ ├── Timer.tsx │ └── ScoreBoard.tsx ├── data/ │ └── awsServices.ts ├── hooks/ │ ├── useFlashCards.ts │ ├── useMatchGame.ts │ └── useProgress.ts ├── pages/ │ ├── HomePage.tsx │ ├── FlashCardPage.tsx │ └── MatchGamePage.tsx ├── types/ │ └── index.ts ├── utils/ │ ├── shuffle.ts │ └── storage.ts ├── App.tsx └── main.tsx

```

### 2. TypeScript Types (`types/index.ts`)

```typescript
interface AWSService {
  id: string
  name: string           // e.g. "EC2", "Lambda"
  fullName: string       // e.g. "Elastic Compute Cloud"
  category: Category
  description: string    // คำอธิบายภาษาไทย (ด้านหน้าการ์ด = ชื่อ service)
  answer: string         // คำตอบ/หน้าที่หลัก
  hint: string           // เกร็ดเพิ่มเติม/tips สอบ
  examTips?: string      // จุดที่มักออกสอบ
}

type Category = 
  | 'Compute'
  | 'Storage'
  | 'Database'
  | 'Networking'
  | 'Security'
  | 'Serverless'
  | 'Management'
  | 'AI/ML'
  | 'Migration'
  | 'Billing'

interface FlashCardState {
  currentIndex: number
  isFlipped: boolean
  knownCards: string[]      // IDs of mastered cards
  unknownCards: string[]    // IDs of cards to review
  category: Category | 'all'
}

interface MatchGameState {
  cards: MatchCard[]
  flippedIndices: number[]
  matchedPairs: string[]
  attempts: number
  startTime: number | null
  isComplete: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}

interface MatchCard {
  id: string
  pairId: string          // service ID — ใช้จับคู่
  content: string         // ชื่อ service หรือ description
  type: 'service' | 'description'
  isFlipped: boolean
  isMatched: boolean
}

interface UserProgress {
  flashCards: {
    totalStudied: number
    mastered: string[]     // service IDs ที่จำได้
    reviewing: string[]    // service IDs ที่ยังไม่แม่น
    lastStudyDate: string
    streak: number         // วันติดต่อกัน
  }
  matchGame: {
    gamesPlayed: number
    bestTime: Record<string, number>  // difficulty → best seconds
    bestScore: Record<string, number> // difficulty → least attempts
    lastPlayDate: string
  }
}

```

### 3. Data (`data/awsServices.ts`)

สร้าง array ของ AWSService ครบ **80+ services** จัดเป็น 10 หมวด:

**Compute (10):** EC2, Lambda, ECS, EKS, Fargate, Elastic Beanstalk, Lightsail, AWS Batch, Outposts, Wavelength

**Storage (7):** S3, EBS, EFS, S3 Glacier, Storage Gateway, Snow Family, FSx

**Database (8):** RDS, Aurora, DynamoDB, ElastiCache, Redshift, Neptune, DocumentDB, QLDB

**Networking (12):** VPC, Security Groups, NACLs, Route 53, CloudFront, ELB (ALB/NLB), API Gateway, Direct Connect, VPN, Transit Gateway, NAT Gateway, Global Accelerator

**Security (15):** IAM, IAM Identity Center, KMS, CloudHSM, Shield, WAF, GuardDuty, Inspector, Macie, Security Hub, CloudTrail, Config, Artifact, ACM, Secrets Manager

**Serverless & Integration (5):** Step Functions, SQS, SNS, EventBridge, Kinesis

**Management (8):** CloudWatch, CloudFormation, CDK, Systems Manager, Trusted Advisor, Organizations, Control Tower, Health Dashboard

**AI/ML (11):** SageMaker, Bedrock, Rekognition, Comprehend, Polly, Transcribe, Translate, Lex, Kendra, Textract, Personalize

**Migration (3):** DMS, Migration Hub, MGN

**Billing (10):** Free Tier, Pricing Calculator, Cost Explorer, Budgets, Consolidated Billing, Savings Plans, Reserved Instances, Spot Instances, Support Plans, Marketplace

ข้อมูลแต่ละ service ต้องมี:

- `answer`: หน้าที่หลัก (ภาษาไทย + ศัพท์เทคนิคอังกฤษ)
- `hint`: เคล็ดลับจำ / use case จริง
- `examTips`: จุดที่มักออกสอบ CLF-C02 (ถ้ามี)

### 4. Mode 1: Flash Cards (`pages/FlashCardPage.tsx`)

**Features:**

- แสดงการ์ดทีละใบ — คลิกพลิก (flip animation 3D)
- ด้านหน้า: ชื่อ Service + หมวด
- ด้านหลัง: คำอธิบาย + Hint + Exam Tips
- ปุ่ม: ✓ จำได้ | ✗ ยังไม่แม่น | ข้าม | สุ่มใหม่
- Filter ตาม Category (ปุ่มด้านบน)
- แสดง Progress Bar + สถิติ (จำได้/ยังไม่แม่น/เหลือ)
- บันทึก progress ลง localStorage
- Keyboard shortcuts: Space=พลิก, ←=ไม่แม่น, →=จำได้, ↑↓=เลื่อน, S=สุ่ม
- มีโหมด "Review" — ดูเฉพาะการ์ดที่ยังไม่แม่น
- มีโหมด "สุ่มทั้งหมด" — reset แล้วสุ่มใหม่

**Components:**

- `FlashCardDeck.tsx` — จัดการลำดับการ์ด + state
- `FlashCard.tsx` — การ์ดพลิกได้ (CSS 3D transform)
- `CategoryFilter.tsx` — ปุ่มเลือกหมวด + แสดงจำนวน

### 5. Mode 2: Match Game (`pages/MatchGamePage.tsx`)

**Concept:** จับคู่ชื่อ Service กับ Description (Memory Game)

**Difficulty Levels:**

- Easy: 4 คู่ (8 การ์ด) — เฉพาะ 1 หมวด
- Medium: 6 คู่ (12 การ์ด) — คละ 2-3 หมวด
- Hard: 8 คู่ (16 การ์ด) — คละทุกหมวด

**Game Flow:**

1. เลือก Difficulty + Category (optional)
2. สุ่ม services ตามจำนวน → สร้างคู่การ์ด (ชื่อ + description)
3. เรียงการ์ดแบบ grid (สุ่มตำแหน่ง)
4. ผู้เล่นคลิกเปิด 2 ใบ:- ถ้าตรงกัน (service ↔ description) → matched! เปิดค้างไว้ + highlight สีเขียว

- ถ้าไม่ตรง → flip กลับ หลัง 1 วินาที

1. จบเกมเมื่อจับคู่ครบ → แสดง Result (เวลา, จำนวนครั้ง, stars)

**Scoring:**

- ⭐⭐⭐ = จำนวน attempts ≤ จำนวนคู่ + 2
- ⭐⭐ = attempts ≤ จำนวนคู่ × 2
- ⭐ = มากกว่านั้น

**Components:**

- `MatchGame.tsx` — Game board + logic
- `MatchCard.tsx` — การ์ดแต่ละใบ (front=?, back=content) มี flip animation
- `MatchResult.tsx` — แสดงผลเมื่อจบเกม (เวลา, attempts, stars, best record)

**UI for Match Cards:**

- Grid layout: responsive (2-4 columns)
- การ์ดด้านหน้า: สีเทา + ไอคอน AWS (?)
- การ์ดด้านหลังแบบ "service": สีน้ำเงิน + ชื่อ service bold
- การ์ดด้านหลังแบบ "description": สีม่วง + description text
- Animation: flip 0.4s, matched = scale pulse + green border
- Timer ด้านบนนับเวลา

### 6. Home Page (`pages/HomePage.tsx`)

- แสดง 2 โหมดให้เลือก: Flash Cards | Match Game
- แสดง Overall Stats: จำนวน services ที่ mastered, streak, best scores
- Quick start: ปุ่ม "ฝึกต่อจากคราวที่แล้ว" (load last session)
- Design: Card-based layout, AWS-themed colors (orange accent)

### 7. Routing

- ใช้ React Router v6
- Routes:- `/` → HomePage
- `/flashcards` → FlashCardPage
- `/match` → MatchGamePage

### 8. Hooks

`useFlashCards.ts`**:**

- จัดการ state ของ deck: current card, flip, next, prev, mark known/unknown
- Filter by category
- Shuffle
- Track progress

`useMatchGame.ts`**:**

- จัดการ game state: generate pairs, flip logic, check match, timer
- Track best score per difficulty
- Handle game completion

`useProgress.ts`**:**

- Read/write localStorage
- Calculate streak (consecutive days)
- Get mastered/reviewing counts
- Get best times/scores

### 9. UI Design Guidelines

- ใช้ Tailwind CSS utility classes
- Color scheme: AWS-themed- Primary: orange-500 (#FF9900) — AWS brand
- Secondary: indigo-600
- Background: slate-50
- Cards: white with shadow-md + rounded-xl
- Category colors:- Compute: blue-500
- Storage: green-500
- Database: purple-500
- Networking: cyan-500
- Security: red-500
- Serverless: amber-500
- Management: gray-600
- AI/ML: pink-500
- Migration: teal-500
- Billing: emerald-500
- Animations:- Card flip: CSS perspective + rotateY (3D)
- Match found: scale bounce + green glow
- Score: count up animation
- Responsive: Desktop-first แต่ใช้ได้บน tablet
- Dark mode: ไม่ต้อง (ใช้ light theme)

### 10. localStorage Schema

```typescript
// Key: "aws-flashcards-progress"
{
  flashCards: {
    totalStudied: 45,
    mastered: ["ec2", "lambda", "s3"],
    reviewing: ["vpc", "iam"],
    lastStudyDate: "2026-08-21",
    streak: 3
  },
  matchGame: {
    gamesPlayed: 12,
    bestTime: { easy: 25, medium: 48, hard: 95 },
    bestScore: { easy: 5, medium: 9, hard: 14 },
    lastPlayDate: "2026-08-21"
  }
}

```

### 11. สิ่งที่ต้องทำให้ทำงานได้จริง

- `npm run dev` → เปิดเว็บได้ทันที
- Flash Cards: พลิกการ์ด, กดจำได้/ไม่แม่น, สุ่ม, filter หมวด → ทำงานครบ
- Match Game: เลือก difficulty, เล่นจับคู่, นับเวลา/attempts, แสดงผล → เล่นได้จริง
- Progress: บันทึกลง localStorage, กลับมาเปิดใหม่เห็น progress เดิม
- Keyboard shortcuts ใช้ได้ใน Flash Card mode
- ไม่มี error ใน console

### 12. Bonus Features (ถ้าทำได้)

- Confetti animation เมื่อ mastered ครบหมวด
- Sound effect เมื่อ match ถูก/ผิด (optional)
- Export progress เป็น JSON
- "Spaced Repetition" — การ์ดที่ไม่แม่นจะโผล่บ่อยกว่า

