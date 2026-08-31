import type {
  SupportFeatureRow,
  SupportPlan,
  SupportPlanTier,
  SupportSeverity,
} from '../types'

/**
 * AWS Support plan reference for the CLF-C02 exam.
 *
 * The exam is still written against the classic five-plan model
 * (Basic / Developer / Business / Enterprise On-Ramp / Enterprise), so that is
 * what this dataset teaches. AWS has since announced that Developer, Business
 * and Enterprise On-Ramp will be retired on 1 January 2027 in favour of the new
 * Business Support+ / Enterprise Support / Unified Operations line-up; that note
 * lives in `SUPPORT_PLAN_NOTICE` and is shown separately so it never gets mixed
 * up with the answer the exam expects.
 *
 * Sources: AWS Support plan comparison and the AWS Support user guide
 * (see `SUPPORT_PLAN_SOURCES`).
 */

/** Thai labels for each case severity, plus a short example. */
export const SEVERITY_LABELS_TH: Record<SupportSeverity, { label: string; example: string }> = {
  'general-guidance': {
    label: 'คำถามทั่วไป',
    example: 'General guidance — ถามวิธีใช้บริการ หรือขอคำแนะนำเชิงแนวทาง',
  },
  'system-impaired': {
    label: 'ระบบทำงานไม่เต็มที่',
    example: 'System impaired — ระบบที่ไม่ใช่ production ทำงานผิดปกติบางส่วน',
  },
  'production-impaired': {
    label: 'production ทำงานไม่เต็มที่',
    example: 'Production system impaired — ระบบจริงยังใช้ได้แต่ประสิทธิภาพตก',
  },
  'production-down': {
    label: 'production ล่ม',
    example: 'Production system down — ระบบจริงใช้งานไม่ได้',
  },
  'business-critical-down': {
    label: 'ระบบวิกฤตของธุรกิจล่ม',
    example: 'Business-critical system down — ระบบที่ธุรกิจหยุดไม่ได้ใช้งานไม่ได้',
  },
}

/** Tailwind accents per plan, from cheapest (slate) to richest (indigo). */
export const SUPPORT_PLAN_STYLES: Record<
  SupportPlanTier,
  { badge: string; ring: string; soft: string; text: string }
> = {
  basic: {
    badge: 'bg-slate-500 text-white',
    ring: 'ring-slate-200',
    soft: 'bg-slate-50',
    text: 'text-slate-700',
  },
  developer: {
    badge: 'bg-sky-500 text-white',
    ring: 'ring-sky-200',
    soft: 'bg-sky-50',
    text: 'text-sky-700',
  },
  business: {
    badge: 'bg-emerald-500 text-white',
    ring: 'ring-emerald-200',
    soft: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  'enterprise-on-ramp': {
    badge: 'bg-orange-500 text-white',
    ring: 'ring-orange-200',
    soft: 'bg-orange-50',
    text: 'text-orange-700',
  },
  enterprise: {
    badge: 'bg-indigo-600 text-white',
    ring: 'ring-indigo-200',
    soft: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
}

/** The five plans, ordered from cheapest to richest. */
export const supportPlans: SupportPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    fullName: 'AWS Basic Support',
    tagline: 'ติดมากับทุกบัญชี AWS ใช้ฟรี ไม่มีการเปิดเคสทางเทคนิค',
    price: 'ฟรี รวมอยู่ในทุกบัญชี AWS',
    channels:
      'เปิดเคสได้เฉพาะเรื่องบัญชีและการเรียกเก็บเงิน กับการขอเพิ่ม service quota ส่วนคำถามทางเทคนิคใช้เอกสาร whitepaper และ AWS re:Post',
    responseTimes: {
      'general-guidance': null,
      'system-impaired': null,
      'production-impaired': null,
      'production-down': null,
      'business-critical-down': null,
    },
    trustedAdvisor: 'เฉพาะ core checks (service quota และ security check พื้นฐาน)',
    tam: 'ไม่มี',
    bestFor: 'บัญชีทดลอง เรียนรู้ หรือ workload ที่ล่มได้ไม่กระทบใคร',
    highlights: [
      'ได้ AWS Health Dashboard ทั้งแบบภาพรวมบริการและแบบเฉพาะบัญชีของตัวเอง',
      'เปิดเคสทางเทคนิคไม่ได้ แต่เปิดเคสเรื่องบิลและ quota ได้',
      'Trusted Advisor เห็นแค่ core checks',
    ],
    examTips:
      'โจทย์ที่บอกว่า "ไม่มีค่าใช้จ่ายเพิ่ม" แต่ต้องการความช่วยเหลือทางเทคนิคแบบเปิดเคส ให้ตัด Basic ออกทันที เพราะ Basic ไม่ให้เปิดเคสทางเทคนิค',
  },
  {
    id: 'developer',
    name: 'Developer',
    fullName: 'AWS Developer Support',
    tagline: 'เริ่มเปิดเคสทางเทคนิคได้ แต่ตอบทางอีเมลในเวลาทำการเท่านั้น',
    price: 'ขั้นต่ำ 29 USD ต่อเดือน หรือ 3% ของค่าใช้จ่ายต่อเดือน แล้วแต่ค่าใดสูงกว่า',
    channels: 'เปิดเคสผ่านเว็บหรืออีเมลในเวลาทำการ ผู้ติดต่อได้ 1 คน (primary contact) เคสไม่จำกัดจำนวน',
    responseTimes: {
      'general-guidance': 'ภายใน 24 ชั่วโมงทำการ',
      'system-impaired': 'ภายใน 12 ชั่วโมงทำการ',
      'production-impaired': null,
      'production-down': null,
      'business-critical-down': null,
    },
    trustedAdvisor: 'เฉพาะ core checks',
    tam: 'ไม่มี',
    bestFor: 'ทีมที่กำลังทดลองหรือพัฒนาระบบใน dev/test ยังไม่ขึ้น production',
    highlights: [
      'ตอบเฉพาะเวลาทำการ ไม่ใช่ 24/7 และไม่มีช่องทางโทรศัพท์หรือแชต',
      'คำแนะนำด้านสถาปัตยกรรมเป็นแบบ general guidance เท่านั้น',
      'ไม่ครอบคลุมความรุนแรงระดับ production ล่ม',
    ],
    examTips:
      'จำคู่กันว่า Developer = dev/test เท่านั้น ถ้าโจทย์เอ่ยถึงคำว่า production ให้เลือก Business ขึ้นไปเสมอ',
  },
  {
    id: 'business',
    name: 'Business',
    fullName: 'AWS Business Support',
    tagline: 'แผนต่ำสุดที่ AWS แนะนำสำหรับ production ตอบ 24/7 ทุกช่องทาง',
    price:
      'ขั้นต่ำ 100 USD ต่อเดือน หรือคิดเป็นขั้นบันไดของค่าใช้จ่าย (10% ของ 10,000 USD แรก, 7%, 5% และ 3% ในช่วงถัดไป) แล้วแต่ค่าใดสูงกว่า',
    channels: 'โทรศัพท์ อีเมล และแชต ตลอด 24 ชั่วโมงทุกวัน ผู้ติดต่อไม่จำกัดจำนวน และเปิดเคสผ่าน AWS Support API ได้',
    responseTimes: {
      'general-guidance': 'ภายใน 24 ชั่วโมง',
      'system-impaired': 'ภายใน 12 ชั่วโมง',
      'production-impaired': 'ภายใน 4 ชั่วโมง',
      'production-down': 'ภายใน 1 ชั่วโมง',
      'business-critical-down': null,
    },
    trustedAdvisor: 'ครบทุก check พร้อมเรียกผ่าน API ได้',
    tam: 'ไม่มี',
    bestFor: 'ระบบ production ทั่วไปที่ต้องการคนรับสายตอนตีสาม แต่ยังไม่ต้องมีที่ปรึกษาประจำ',
    highlights: [
      'ได้ Trusted Advisor ครบทุก check ซึ่งเป็นเส้นแบ่งสำคัญจาก Developer',
      'ได้สิทธิ์ถามเรื่องการใช้ third-party software ร่วมกับ AWS',
      'มี AWS Support API และ AWS Health API สำหรับดึงข้อมูลอัตโนมัติ',
      'คำแนะนำสถาปัตยกรรมเป็นแบบ contextual guidance ตามการใช้งานจริง',
    ],
    examTips:
      'คำใบ้ที่พาไป Business คือ "production ล่มต้องตอบใน 1 ชั่วโมง" "ต้องการ 24/7 ทางโทรศัพท์" หรือ "ต้องการ Trusted Advisor ครบทุก check" โดยยังไม่พูดถึงที่ปรึกษาประจำ',
  },
  {
    id: 'enterprise-on-ramp',
    name: 'Enterprise On-Ramp',
    fullName: 'AWS Enterprise On-Ramp Support',
    tagline: 'ทางผ่านสู่ Enterprise ได้ TAM แบบทีมกลาง และตอบเคสวิกฤตใน 30 นาที',
    price: 'ขั้นต่ำ 5,500 USD ต่อเดือน หรือคิดเป็นขั้นบันไดของค่าใช้จ่าย แล้วแต่ค่าใดสูงกว่า',
    channels: 'โทรศัพท์ อีเมล และแชต ตลอด 24 ชั่วโมงทุกวัน ผู้ติดต่อไม่จำกัดจำนวน',
    responseTimes: {
      'general-guidance': 'ภายใน 24 ชั่วโมง',
      'system-impaired': 'ภายใน 12 ชั่วโมง',
      'production-impaired': 'ภายใน 4 ชั่วโมง',
      'production-down': 'ภายใน 1 ชั่วโมง',
      'business-critical-down': 'ภายใน 30 นาที',
    },
    trustedAdvisor: 'ครบทุก check',
    tam: 'เข้าถึงกลุ่ม Technical Account Manager (pool of TAMs) ไม่ใช่คนประจำเจ้าเดียว',
    bestFor: 'องค์กรที่เริ่มมี workload สำคัญบน AWS แต่ยังไม่พร้อมจ่ายระดับ Enterprise',
    highlights: [
      'เพิ่มระดับความรุนแรง business-critical system down เข้ามา ตอบใน 30 นาที',
      'ได้ที่ปรึกษาเป็นทีมกลาง (pool) ต่างจาก Enterprise ที่เป็น TAM ประจำ',
      'ได้ consultative review และคำแนะนำเชิงสถาปัตยกรรมตามแอปพลิเคชันของตัวเอง',
      'ได้ Infrastructure Event Management 1 ครั้งต่อปี',
    ],
    examTips:
      'ถ้าโจทย์อยากได้ TAM แต่บอกว่างบจำกัด หรือระบุเวลาตอบ 30 นาที คำตอบคือ Enterprise On-Ramp ไม่ใช่ Enterprise',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    fullName: 'AWS Enterprise Support',
    tagline: 'ระดับสูงสุด มี TAM ประจำ และตอบเคสวิกฤตใน 15 นาที',
    price: 'ขั้นต่ำ 15,000 USD ต่อเดือน หรือคิดเป็นขั้นบันไดของค่าใช้จ่าย แล้วแต่ค่าใดสูงกว่า',
    channels: 'โทรศัพท์ อีเมล และแชต ตลอด 24 ชั่วโมงทุกวัน ต่อสายถึงวิศวกรระดับสูงได้ทันที',
    responseTimes: {
      'general-guidance': 'ภายใน 24 ชั่วโมง',
      'system-impaired': 'ภายใน 12 ชั่วโมง',
      'production-impaired': 'ภายใน 4 ชั่วโมง',
      'production-down': 'ภายใน 1 ชั่วโมง',
      'business-critical-down': 'ภายใน 15 นาที',
    },
    trustedAdvisor: 'ครบทุก check พร้อมการทบทวนร่วมกับ TAM',
    tam: 'มี Technical Account Manager ประจำบัญชี (designated TAM)',
    bestFor: 'ระบบ mission-critical ที่ธุรกิจหยุดไม่ได้ และองค์กรที่ต้องการที่ปรึกษาประจำ',
    highlights: [
      'เวลาตอบเคสวิกฤต 15 นาที เร็วที่สุดในบรรดาแผนที่ออกสอบ',
      'TAM ประจำที่รู้จักระบบของลูกค้า ช่วยวางแผนและทบทวนสถาปัตยกรรม',
      'ได้ Infrastructure Event Management รวมในแผน',
      'ได้ Concierge สำหรับคำถามด้านบัญชีและค่าใช้จ่าย และสิทธิ์ Well-Architected review',
    ],
    examTips:
      'สองคำที่ชี้ตรงมา Enterprise คือ "designated TAM" และ "15 นาที" ถ้าเห็นคำใดคำหนึ่งแทบไม่ต้องอ่านตัวเลือกอื่น',
  },
]

/** Feature matrix rows, in the order shown on the page. */
export const supportFeatureRows: SupportFeatureRow[] = [
  {
    label: 'เปิดเคสทางเทคนิค',
    values: {
      basic: false,
      developer: 'ไม่จำกัดจำนวนเคส',
      business: 'ไม่จำกัดจำนวนเคส',
      'enterprise-on-ramp': 'ไม่จำกัดจำนวนเคส',
      enterprise: 'ไม่จำกัดจำนวนเคส',
    },
  },
  {
    label: 'ช่องทางและเวลาให้บริการ',
    values: {
      basic: 'เอกสารและ re:Post',
      developer: 'เว็บและอีเมล เวลาทำการ',
      business: 'โทร แชต อีเมล 24/7',
      'enterprise-on-ramp': 'โทร แชต อีเมล 24/7',
      enterprise: 'โทร แชต อีเมล 24/7',
    },
  },
  {
    label: 'จำนวนผู้ติดต่อที่เปิดเคสได้',
    values: {
      basic: '—',
      developer: '1 คน',
      business: 'ไม่จำกัด',
      'enterprise-on-ramp': 'ไม่จำกัด',
      enterprise: 'ไม่จำกัด',
    },
  },
  {
    label: 'Trusted Advisor',
    values: {
      basic: 'core checks',
      developer: 'core checks',
      business: 'ครบทุก check',
      'enterprise-on-ramp': 'ครบทุก check',
      enterprise: 'ครบทุก check',
    },
  },
  {
    label: 'คำแนะนำด้านสถาปัตยกรรม',
    values: {
      basic: false,
      developer: 'general guidance',
      business: 'contextual guidance',
      'enterprise-on-ramp': 'consultative review',
      enterprise: 'consultative review',
    },
  },
  {
    label: 'Technical Account Manager',
    values: {
      basic: false,
      developer: false,
      business: false,
      'enterprise-on-ramp': 'แบบทีมกลาง (pool)',
      enterprise: 'ประจำบัญชี (designated)',
    },
  },
  {
    label: 'สนับสนุน third-party software',
    values: {
      basic: false,
      developer: false,
      business: true,
      'enterprise-on-ramp': true,
      enterprise: true,
    },
  },
  {
    label: 'AWS Support API และ Health API',
    values: {
      basic: false,
      developer: false,
      business: true,
      'enterprise-on-ramp': true,
      enterprise: true,
    },
  },
  {
    label: 'Infrastructure Event Management',
    values: {
      basic: false,
      developer: false,
      business: 'ซื้อเพิ่มได้',
      'enterprise-on-ramp': '1 ครั้งต่อปี',
      enterprise: 'รวมในแผน',
    },
  },
  {
    label: 'ทีม Concierge ด้านบัญชีและค่าใช้จ่าย',
    values: {
      basic: false,
      developer: false,
      business: false,
      'enterprise-on-ramp': true,
      enterprise: true,
    },
  },
]

/** Short memory aids that map exam wording to the right plan. */
export const supportPlanCues: { cue: string; answer: string }[] = [
  { cue: 'ไม่มีค่าใช้จ่าย ใช้เอกสารและ re:Post เท่านั้น', answer: 'Basic' },
  { cue: 'เป็นระบบ dev/test ถามทางอีเมลในเวลาทำการก็พอ', answer: 'Developer' },
  { cue: 'production ล่มต้องได้คำตอบใน 1 ชั่วโมง หรือขอ Trusted Advisor ครบทุก check', answer: 'Business' },
  { cue: 'ต้องการ 24/7 ทางโทรศัพท์สำหรับระบบ production', answer: 'Business ขึ้นไป' },
  { cue: 'ต้องการ TAM แต่งบยังไม่ถึงระดับสูงสุด หรือระบุเวลาตอบ 30 นาที', answer: 'Enterprise On-Ramp' },
  { cue: 'ต้องการ designated TAM หรือระบุเวลาตอบ 15 นาที', answer: 'Enterprise' },
  { cue: 'ขอรายงาน compliance อย่าง SOC หรือ ISO', answer: 'AWS Artifact ไม่เกี่ยวกับแผน support' },
]

/**
 * Change AWS announced after the CLF-C02 blueprint was written. Shown as a
 * side note so learners answer the exam with the classic five plans but are not
 * surprised by the AWS console.
 */
export const SUPPORT_PLAN_NOTICE =
  'AWS ประกาศว่าจะเลิกให้บริการแผน Developer, Business และ Enterprise On-Ramp ในวันที่ 1 มกราคม 2027 แล้วปรับไปใช้ชุดใหม่คือ Business Support+, Enterprise Support และ Unified Operations ลูกค้า Enterprise On-Ramp เดิมจะถูกอัปเกรดเป็น Enterprise Support ระหว่างปี 2026 อย่างไรก็ดี ข้อสอบ CLF-C02 ยังอ้างอิงแผนเดิม 5 ระดับตามตารางด้านบน ให้ตอบตามแผนเดิมเมื่อเข้าห้องสอบ'

/** Where the numbers on this page come from. */
export const SUPPORT_PLAN_SOURCES: { label: string; url: string }[] = [
  { label: 'AWS Support plan comparison', url: 'https://aws.amazon.com/premiumsupport/plans/' },
  {
    label: 'AWS Support User Guide — Support plans',
    url: 'https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html',
  },
]

/** Lookup by tier id, for cross-linking from other pages. */
export const supportPlanById: Record<SupportPlanTier, SupportPlan> = supportPlans.reduce(
  (acc, plan) => {
    acc[plan.id] = plan
    return acc
  },
  {} as Record<SupportPlanTier, SupportPlan>,
)
