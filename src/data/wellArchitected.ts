import type { PillarDrillItem, PillarId, WellArchitectedPillar } from '../types'

/**
 * AWS Well-Architected Framework reference for the CLF-C02 exam.
 *
 * Pillar names, definitions and design principles follow the current AWS
 * Well-Architected Framework documentation (see `WA_SOURCES`). The design
 * principle wording is kept in English on purpose because that is the phrasing
 * the exam reuses in its answer options; the Thai line explains each one.
 */

/** Tailwind accents per pillar. */
export const PILLAR_STYLES: Record<
  PillarId,
  { badge: string; ring: string; soft: string; text: string; dot: string }
> = {
  'operational-excellence': {
    badge: 'bg-slate-600 text-white',
    ring: 'ring-slate-200',
    soft: 'bg-slate-50',
    text: 'text-slate-700',
    dot: 'bg-slate-600',
  },
  security: {
    badge: 'bg-red-500 text-white',
    ring: 'ring-red-200',
    soft: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  reliability: {
    badge: 'bg-blue-500 text-white',
    ring: 'ring-blue-200',
    soft: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  'performance-efficiency': {
    badge: 'bg-purple-500 text-white',
    ring: 'ring-purple-200',
    soft: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  'cost-optimization': {
    badge: 'bg-emerald-500 text-white',
    ring: 'ring-emerald-200',
    soft: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  sustainability: {
    badge: 'bg-teal-500 text-white',
    ring: 'ring-teal-200',
    soft: 'bg-teal-50',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
  },
}

/** The six pillars, in the order AWS publishes them. */
export const wellArchitectedPillars: WellArchitectedPillar[] = [
  {
    id: 'operational-excellence',
    name: 'Operational Excellence',
    nameTh: 'ความเป็นเลิศด้านปฏิบัติการ',
    focus: 'รันระบบและติดตามผลได้ดีแค่ไหน แล้วปรับปรุงกระบวนการต่อเนื่องได้อย่างไร',
    definition:
      'ความสามารถในการสนับสนุนการพัฒนาและรันงานได้อย่างมีประสิทธิภาพ มองเห็นสิ่งที่เกิดขึ้นในระบบ และปรับปรุงกระบวนการกับขั้นตอนปฏิบัติงานให้ดีขึ้นเรื่อย ๆ',
    principles: [
      {
        en: 'Organize teams around business outcomes',
        th: 'จัดทีมให้ยึดผลลัพธ์ทางธุรกิจเป็นตัวตั้ง ไม่ใช่ยึดเทคโนโลยี',
      },
      {
        en: 'Implement observability for actionable insights',
        th: 'ทำ observability เพื่อรู้พฤติกรรม ประสิทธิภาพ และสุขภาพของระบบจนลงมือแก้ได้ทัน',
      },
      {
        en: 'Safely automate where possible',
        th: 'ทำงานให้เป็นอัตโนมัติอย่างปลอดภัย นิยามทั้งระบบเป็นโค้ดและมี guardrail',
      },
      {
        en: 'Make frequent, small, reversible changes',
        th: 'เปลี่ยนบ่อย ๆ ทีละน้อย และย้อนกลับได้ เพื่อลด blast radius',
      },
      {
        en: 'Refine operations procedures frequently',
        th: 'ทบทวนและขัดเกลาขั้นตอนปฏิบัติงานอยู่เสมอ',
      },
      {
        en: 'Anticipate failure',
        th: 'ซ้อมสถานการณ์ล้มเหลวไว้ล่วงหน้าเพื่อรู้ความเสี่ยงจริง',
      },
      {
        en: 'Learn from all operational events and metrics',
        th: 'เรียนรู้จากทุกเหตุการณ์และตัวชี้วัด แล้วแบ่งบทเรียนให้ทั้งองค์กร',
      },
      {
        en: 'Use managed services',
        th: 'ใช้ managed service เพื่อลดภาระงานปฏิบัติการ',
      },
    ],
    keywords: [
      'infrastructure as code',
      'CI/CD และการ deploy อัตโนมัติ',
      'runbook / playbook',
      'monitoring และ logging เพื่อปรับปรุงกระบวนการ',
      'small reversible changes',
    ],
    services: ['cloudformation', 'systems-manager', 'cloudwatch', 'cloudtrail', 'config'],
    examTips:
      'เส้นแบ่งที่คนพลาดบ่อยคือ Operational Excellence เน้น "กระบวนการทำงานและการปรับปรุง" ส่วน Reliability เน้น "ระบบยังให้บริการอยู่ได้" ถ้าโจทย์พูดถึง IaC, CI/CD หรือ runbook ให้ตอบ Operational Excellence',
  },
  {
    id: 'security',
    name: 'Security',
    nameTh: 'ความปลอดภัย',
    focus: 'ปกป้องข้อมูล ระบบ และสินทรัพย์ได้ดีแค่ไหน',
    definition:
      'ความสามารถในการปกป้องข้อมูล ระบบ และสินทรัพย์ โดยใช้เทคโนโลยีคลาวด์ช่วยยกระดับความปลอดภัย',
    principles: [
      {
        en: 'Implement a strong identity foundation',
        th: 'วางรากฐานเรื่องตัวตนให้แน่น ใช้ least privilege แยกหน้าที่ และเลิกพึ่ง credential ถาวร',
      },
      {
        en: 'Maintain traceability',
        th: 'ตรวจสอบย้อนหลังได้ มี log แจ้งเตือน และ audit การเปลี่ยนแปลงแบบเรียลไทม์',
      },
      {
        en: 'Apply security at all layers',
        th: 'ป้องกันเป็นชั้น ๆ แบบ defense in depth ตั้งแต่ขอบเครือข่ายจนถึงโค้ด',
      },
      {
        en: 'Automate security best practices',
        th: 'ทำมาตรการความปลอดภัยให้เป็นอัตโนมัติและจัดการเป็นโค้ด',
      },
      {
        en: 'Protect data in transit and at rest',
        th: 'เข้ารหัสข้อมูลทั้งตอนส่งและตอนเก็บ พร้อมจัดชั้นความอ่อนไหวของข้อมูล',
      },
      {
        en: 'Keep people away from data',
        th: 'ลดการที่คนต้องแตะข้อมูลโดยตรง เพื่อลดความผิดพลาดของมนุษย์',
      },
      {
        en: 'Prepare for security events',
        th: 'เตรียมแผนรับมือเหตุการณ์ด้านความปลอดภัยและซ้อมรับมือไว้ล่วงหน้า',
      },
    ],
    keywords: [
      'least privilege และ IAM',
      'MFA',
      'encryption at rest / in transit',
      'defense in depth',
      'incident response',
    ],
    services: ['iam', 'kms', 'guardduty', 'waf', 'shield', 'secrets-manager'],
    examTips:
      'Security มี 7 design principles มากที่สุดในบรรดา pillar ที่ออกสอบบ่อย ถ้าเห็นคำว่า least privilege, MFA, เข้ารหัส หรือ traceability ให้ตอบ Security ทันที',
  },
  {
    id: 'reliability',
    name: 'Reliability',
    nameTh: 'ความเชื่อถือได้',
    focus: 'ระบบทำงานได้ตามที่ควรและกู้คืนจากความล้มเหลวได้แค่ไหน',
    definition:
      'ความสามารถของ workload ในการทำหน้าที่ที่ถูกต้องได้อย่างสม่ำเสมอตามที่คาดหวัง รวมถึงกู้คืนจากความล้มเหลวและปรับตามความต้องการที่เปลี่ยนไป',
    principles: [
      {
        en: 'Automatically recover from failure',
        th: 'กู้คืนจากความล้มเหลวโดยอัตโนมัติ โดยเฝ้าดู KPI แล้วสั่งงานอัตโนมัติเมื่อทะลุเกณฑ์',
      },
      {
        en: 'Test recovery procedures',
        th: 'ทดสอบขั้นตอนกู้คืนจริง ไม่ใช่แค่ทดสอบว่าระบบทำงานได้',
      },
      {
        en: 'Scale horizontally to increase aggregate workload availability',
        th: 'ขยายแนวนอนด้วยเครื่องเล็กหลายตัวแทนเครื่องใหญ่ตัวเดียว เพื่อลดผลจากจุดล้มเหลวเดียว',
      },
      {
        en: 'Stop guessing capacity',
        th: 'เลิกเดาความจุ ใช้การเฝ้าดูความต้องการจริงแล้วเพิ่มลดทรัพยากรอัตโนมัติ',
      },
      {
        en: 'Manage change through automation',
        th: 'เปลี่ยนแปลง infrastructure ผ่านระบบอัตโนมัติเพื่อให้ตามรอยและทบทวนได้',
      },
    ],
    keywords: [
      'Multi-AZ และหลาย Region',
      'Auto Scaling และ Elastic Load Balancing',
      'backup, DR, RTO/RPO',
      'fault tolerance และ high availability',
      'ทดสอบการกู้คืน',
    ],
    services: ['elb', 'route-53', 'rds', 's3', 'cloudwatch'],
    examTips:
      'คำว่า "ล่มแล้วยังให้บริการต่อได้" หรือ "กู้คืนได้" คือ Reliability ส่วนคำว่า "เร็วขึ้น" หรือ "latency" คือ Performance Efficiency อย่าสับสนสองตัวนี้',
  },
  {
    id: 'performance-efficiency',
    name: 'Performance Efficiency',
    nameTh: 'ประสิทธิภาพการทำงาน',
    focus: 'ใช้ทรัพยากรอย่างมีประสิทธิภาพเพื่อรองรับความต้องการที่เปลี่ยนไปได้แค่ไหน',
    definition:
      'ความสามารถในการใช้ทรัพยากรคอมพิวเตอร์อย่างมีประสิทธิภาพเพื่อตอบความต้องการของระบบ และคงประสิทธิภาพไว้ได้เมื่อความต้องการหรือเทคโนโลยีเปลี่ยน',
    principles: [
      {
        en: 'Democratize advanced technologies',
        th: 'ยกงานเทคนิคยาก ๆ ให้ผู้ให้บริการคลาวด์ทำ แล้วใช้เป็นบริการ เช่น NoSQL หรือ machine learning',
      },
      {
        en: 'Go global in minutes',
        th: 'ขยายไปหลาย Region ได้ในไม่กี่นาที เพื่อลด latency ให้ผู้ใช้ทั่วโลก',
      },
      {
        en: 'Use serverless architectures',
        th: 'ใช้สถาปัตยกรรม serverless เพื่อตัดภาระการดูแลเซิร์ฟเวอร์',
      },
      {
        en: 'Experiment more often',
        th: 'ทดลองบ่อยขึ้น เทียบ instance type, storage และการตั้งค่าต่าง ๆ ได้เร็ว',
      },
      {
        en: 'Consider mechanical sympathy',
        th: 'เลือกเทคโนโลยีให้ตรงกับเป้าหมายของงาน เช่นดูรูปแบบการเข้าถึงข้อมูลก่อนเลือกฐานข้อมูล',
      },
    ],
    keywords: [
      'latency และ throughput',
      'เลือก instance type ให้เหมาะ',
      'caching เช่น CloudFront หรือ ElastiCache',
      'serverless',
      'ขยายไปหลาย Region เพื่อความเร็ว',
    ],
    services: ['cloudfront', 'elasticache', 'lambda', 'dynamodb', 'ec2'],
    examTips:
      'จำวลี "Consider mechanical sympathy" ให้ได้ เพราะเป็นตัวเลือกที่ดูแปลกที่สุดแต่เป็นของจริงใน pillar นี้ และมักถูกใช้เป็นคำตอบที่ถูก',
  },
  {
    id: 'cost-optimization',
    name: 'Cost Optimization',
    nameTh: 'การใช้ต้นทุนให้คุ้มค่า',
    focus: 'ได้คุณค่าทางธุรกิจสูงสุดต่อเงินที่จ่ายหรือไม่',
    definition:
      'ความสามารถในการรันระบบให้ได้คุณค่าทางธุรกิจตามต้องการด้วยจุดราคาที่ต่ำที่สุด',
    principles: [
      {
        en: 'Implement Cloud Financial Management',
        th: 'สร้างความสามารถด้านการบริหารการเงินบนคลาวด์ (Cloud FinOps) ให้เป็นเรื่องที่มีคนดูแลจริง',
      },
      {
        en: 'Adopt a consumption model',
        th: 'จ่ายเท่าที่ใช้ เพิ่มลดตามความต้องการจริง เช่นปิดเครื่อง dev/test นอกเวลางาน',
      },
      {
        en: 'Measure overall efficiency',
        th: 'วัดผลลัพธ์ทางธุรกิจเทียบกับต้นทุนที่จ่ายไป',
      },
      {
        en: 'Stop spending money on undifferentiated heavy lifting',
        th: 'เลิกจ่ายกับงานที่ไม่สร้างความต่าง เช่นดูแล data center หรือแพตช์ OS เอง',
      },
      {
        en: 'Analyze and attribute expenditure',
        th: 'วิเคราะห์และปันค่าใช้จ่ายให้เจ้าของ workload ด้วย tag และรายงาน',
      },
    ],
    keywords: [
      'right-sizing',
      'Reserved Instances, Savings Plans, Spot',
      'ปิดทรัพยากรที่ไม่ใช้',
      'tagging และ cost allocation',
      'Cost Explorer และ Budgets',
    ],
    services: ['cost-explorer', 'budgets', 'savings-plans', 'reserved-instances', 'trusted-advisor'],
    examTips:
      'Cost Optimization พูดถึงเงิน ส่วน Sustainability พูดถึงทรัพยากรและพลังงาน สองอันนี้ใช้วิธีคล้ายกัน (right-sizing, managed services) แต่ให้ดูว่าโจทย์วัดผลด้วยอะไร',
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    nameTh: 'ความยั่งยืน',
    focus: 'ลดผลกระทบต่อสิ่งแวดล้อมจากการรัน workload ได้แค่ไหน',
    definition:
      'การลดผลกระทบต่อสิ่งแวดล้อมจากการรัน workload บนคลาวด์ เช่นการใช้พลังงานและประสิทธิภาพการใช้ทรัพยากร',
    principles: [
      { en: 'Understand your impact', th: 'วัดผลกระทบที่ระบบสร้างขึ้นและคาดการณ์ผลกระทบในอนาคต' },
      {
        en: 'Establish sustainability goals',
        th: 'ตั้งเป้าระยะยาว เช่นลดทรัพยากรที่ใช้ต่อหนึ่ง transaction',
      },
      {
        en: 'Maximize utilization',
        th: 'ใช้ทรัพยากรให้เต็มเม็ดเต็มหน่วย right-size และลดเครื่องที่นิ่งเฉย',
      },
      {
        en: 'Anticipate and adopt new, more efficient hardware and software offerings',
        th: 'ตามและเปลี่ยนไปใช้ฮาร์ดแวร์และซอฟต์แวร์ที่ประหยัดพลังงานกว่าเมื่อมีของใหม่',
      },
      {
        en: 'Use managed services',
        th: 'ใช้ managed service เพราะการแชร์ทรัพยากรร่วมกันทำให้ใช้โครงสร้างพื้นฐานน้อยลง',
      },
      {
        en: 'Reduce the downstream impact of your cloud workloads',
        th: 'ลดผลกระทบปลายทาง เช่นไม่บังคับให้ผู้ใช้ต้องอัปเกรดอุปกรณ์',
      },
    ],
    keywords: [
      'carbon footprint',
      'ประสิทธิภาพการใช้พลังงาน',
      'ลดเครื่องที่นิ่งเฉย',
      'เลือก Region ที่ใช้พลังงานสะอาด',
      'Graviton และฮาร์ดแวร์ที่ประหยัดกว่า',
    ],
    services: ['fargate', 'lambda', 's3-glacier', 'ec2'],
    examTips:
      'Sustainability เป็น pillar ที่ 6 เพิ่มเข้ามาปี 2021 เป็นตัวเดียวที่พูดถึงสิ่งแวดล้อมโดยตรง ถ้าเห็นคำว่า carbon footprint หรือผลกระทบต่อสิ่งแวดล้อม เลือกอันนี้ได้เลย',
  },
]

/** Lookup by pillar id. */
export const pillarById: Record<PillarId, WellArchitectedPillar> =
  wellArchitectedPillars.reduce(
    (acc, pillar) => {
      acc[pillar.id] = pillar
      return acc
    },
    {} as Record<PillarId, WellArchitectedPillar>,
  )

/** Number of design principles per pillar, for the "จำตัวเลข" summary. */
export const principleCounts: Record<PillarId, number> = wellArchitectedPillars.reduce(
  (acc, pillar) => {
    acc[pillar.id] = pillar.principles.length
    return acc
  },
  {} as Record<PillarId, number>,
)

/** Thai mnemonics for remembering all six pillars and their order. */
export const PILLAR_MNEMONICS: { label: string; value: string; note: string }[] = [
  {
    label: 'อักษรแรกภาษาอังกฤษ',
    value: 'O · S · R · P · C · S',
    note: 'Operational excellence, Security, Reliability, Performance efficiency, Cost optimization, Sustainability — เรียงตามที่ AWS ประกาศ',
  },
  {
    label: 'ประโยคช่วยจำ',
    value: 'Only Smart Racers Post Cool Selfies',
    note: 'ประโยคไร้สาระแต่จำง่าย ใช้ดึงตัวอักษรแรกของทั้ง 6 pillar ตามลำดับ',
  },
  {
    label: 'ท่องเป็นภาษาไทย',
    value: 'ปฏิบัติการ · ปลอดภัย · เชื่อถือได้ · เร็ว · คุ้มค่า · ยั่งยืน',
    note: 'ถ้าจำภาษาอังกฤษไม่ทัน ท่องไทย 6 คำนี้ก่อนแล้วค่อยแมปกลับเป็นชื่อ pillar',
  },
  {
    label: 'จำจำนวน design principles',
    value: '8 · 7 · 5 · 5 · 5 · 6',
    note: 'Operational Excellence 8, Security 7, Reliability 5, Performance Efficiency 5, Cost Optimization 5, Sustainability 6',
  },
]

/** Pairs of pillars the exam likes to put against each other. */
export const PILLAR_CONFUSIONS: { pair: string; rule: string }[] = [
  {
    pair: 'Operational Excellence กับ Reliability',
    rule: 'ถามถึงกระบวนการ deploy, runbook หรือ IaC = Operational Excellence · ถามถึงระบบล่มแล้วกู้คืน = Reliability',
  },
  {
    pair: 'Reliability กับ Performance Efficiency',
    rule: 'ต้องการ "ไม่ล่ม" หรือ "กู้คืนได้" = Reliability · ต้องการ "เร็วขึ้น" หรือ "latency ต่ำ" = Performance Efficiency',
  },
  {
    pair: 'Cost Optimization กับ Sustainability',
    rule: 'วัดผลด้วยเงินที่ประหยัด = Cost Optimization · วัดผลด้วยพลังงานหรือ carbon = Sustainability',
  },
  {
    pair: 'Security กับ Reliability',
    rule: 'ป้องกันคนร้ายหรือข้อมูลรั่ว = Security · ป้องกันระบบล่มจากความผิดพลาดหรือโหลด = Reliability',
  },
  {
    pair: 'Well-Architected Framework กับ Cloud Adoption Framework',
    rule: 'WAF = ออกแบบและทบทวน workload ทางเทคนิค (6 pillars) · CAF = แผนการย้ายองค์กรขึ้นคลาวด์ระดับธุรกิจ (6 perspectives) อย่าสลับกัน',
  },
]

/** Facts about the tool and lenses that the exam also asks about. */
export const WA_TOOL_FACTS: string[] = [
  'AWS Well-Architected Tool อยู่ใน AWS Management Console ใช้ฟรี ไม่มีค่าบริการ',
  'วิธีใช้คือตอบชุดคำถามตาม pillar แล้วเครื่องมือจะออกรายงานความเสี่ยงพร้อมแผนปรับปรุง',
  'Lens คือชุดคำถามเฉพาะทาง เช่น Serverless Lens, SaaS Lens, Machine Learning Lens ใช้ทบทวนเจาะตามประเภทงาน',
  'ลูกค้าแผน Enterprise Support จะได้ทบทวน Well-Architected ร่วมกับ Technical Account Manager',
  'กรอบนี้ไม่ใช่ข้อบังคับและไม่ได้ให้ใบรับรอง เป็นแนวทางเปรียบเทียบข้อดีข้อเสียของการตัดสินใจออกแบบ',
]

/** Cues for the recall drill. Mixed across pillars on purpose. */
export const pillarDrillItems: PillarDrillItem[] = [
  {
    id: 'drill-iac',
    cue: 'ทีมอยากนิยาม infrastructure ทั้งหมดเป็นเทมเพลตโค้ด แล้ว deploy ซ้ำได้เหมือนกันทุกครั้ง',
    answer: 'operational-excellence',
    why: 'การทำงานเป็นโค้ดและ deploy อัตโนมัติคือหัวใจของ Operational Excellence ตามหลัก Safely automate where possible',
  },
  {
    id: 'drill-mfa',
    cue: 'บังคับเปิด MFA ให้ทุกบัญชีและให้สิทธิ์เท่าที่จำเป็นเท่านั้น',
    answer: 'security',
    why: 'least privilege และ MFA อยู่ในหลัก Implement a strong identity foundation ของ Security',
  },
  {
    id: 'drill-multi-az',
    cue: 'ย้ายฐานข้อมูลเป็นแบบ Multi-AZ เพื่อให้ระบบยังใช้ได้เมื่อ AZ หนึ่งล่ม',
    answer: 'reliability',
    why: 'การทนต่อความล้มเหลวและกู้คืนได้เองคือ Reliability',
  },
  {
    id: 'drill-cloudfront',
    cue: 'ผู้ใช้ในยุโรปโหลดเว็บช้า ทีมจึงเพิ่ม CDN เพื่อลด latency',
    answer: 'performance-efficiency',
    why: 'เรื่องความเร็วและ latency คือ Performance Efficiency ตามหลัก Go global in minutes',
  },
  {
    id: 'drill-rightsizing',
    cue: 'พบว่าเครื่องหลายตัวใช้ CPU แค่ 5% จึงลดขนาดเครื่องเพื่อประหยัดเงิน',
    answer: 'cost-optimization',
    why: 'right-sizing เพื่อลดค่าใช้จ่ายคือ Cost Optimization เพราะวัดผลด้วยเงิน',
  },
  {
    id: 'drill-carbon',
    cue: 'ฝ่ายความยั่งยืนขอให้ลด carbon footprint ของ workload ลง 30% ภายในปีนี้',
    answer: 'sustainability',
    why: 'ผลกระทบต่อสิ่งแวดล้อมและพลังงานคือ Sustainability',
  },
  {
    id: 'drill-runbook',
    cue: 'ทีมทบทวน runbook ทุกไตรมาสและซ้อมรับมือเหตุขัดข้องเป็นประจำ',
    answer: 'operational-excellence',
    why: 'Refine operations procedures frequently และ Anticipate failure อยู่ใน Operational Excellence',
  },
  {
    id: 'drill-encryption',
    cue: 'เข้ารหัสข้อมูลทั้งตอนส่งผ่านเครือข่ายและตอนเก็บใน S3',
    answer: 'security',
    why: 'Protect data in transit and at rest เป็นหลักของ Security',
  },
  {
    id: 'drill-autoscaling',
    cue: 'ตั้ง Auto Scaling ให้เพิ่มเครื่องอัตโนมัติเมื่อโหลดพุ่ง เพื่อไม่ให้ระบบล่มจากทรัพยากรไม่พอ',
    answer: 'reliability',
    why: 'Stop guessing capacity เป็นหลักของ Reliability เพราะเป้าหมายคือระบบไม่ล่ม',
  },
  {
    id: 'drill-serverless',
    cue: 'เปลี่ยนงานประมวลผลไปใช้ Lambda เพื่อไม่ต้องดูแลเซิร์ฟเวอร์และรองรับโหลดได้ดีขึ้น',
    answer: 'performance-efficiency',
    why: 'Use serverless architectures เป็นหลักของ Performance Efficiency',
  },
  {
    id: 'drill-tagging',
    cue: 'ติด tag ทุกทรัพยากรเพื่อปันค่าใช้จ่ายกลับไปที่แต่ละแผนก',
    answer: 'cost-optimization',
    why: 'Analyze and attribute expenditure เป็นหลักของ Cost Optimization',
  },
  {
    id: 'drill-idle',
    cue: 'ปิดทรัพยากรที่นิ่งเฉยและรวมงานให้เครื่องทำงานเต็มกำลัง เพื่อลดพลังงานที่ใช้',
    answer: 'sustainability',
    why: 'Maximize utilization เป็นหลักของ Sustainability เพราะโจทย์วัดผลด้วยพลังงาน',
  },
  {
    id: 'drill-dr-test',
    cue: 'ซ้อมกู้คืนระบบจาก backup ทุกครึ่งปีเพื่อยืนยันว่า RTO ที่ตั้งไว้ทำได้จริง',
    answer: 'reliability',
    why: 'Test recovery procedures เป็นหลักของ Reliability',
  },
  {
    id: 'drill-observability',
    cue: 'วาง dashboard และ KPI ให้เห็นสุขภาพระบบ เพื่อให้ทีมตัดสินใจแก้ปัญหาได้เร็วขึ้น',
    answer: 'operational-excellence',
    why: 'Implement observability for actionable insights เป็นหลักของ Operational Excellence',
  },
  {
    id: 'drill-incident',
    cue: 'จัดทำแผนรับมือเหตุข้อมูลรั่วและซ้อมทีมตอบสนองเหตุการณ์',
    answer: 'security',
    why: 'Prepare for security events เป็นหลักของ Security',
  },
  {
    id: 'drill-consumption',
    cue: 'ปิดเครื่อง dev/test นอกเวลาทำงานเพราะจ่ายเท่าที่ใช้',
    answer: 'cost-optimization',
    why: 'Adopt a consumption model เป็นหลักของ Cost Optimization',
  },
  {
    id: 'drill-graviton',
    cue: 'ย้ายไปใช้ instance รุ่นใหม่ที่ประหยัดพลังงานกว่าเมื่อ AWS เปิดให้ใช้',
    answer: 'sustainability',
    why: 'Anticipate and adopt new, more efficient hardware and software offerings เป็นหลักของ Sustainability',
  },
  {
    id: 'drill-mechanical',
    cue: 'เลือกชนิดฐานข้อมูลโดยดูรูปแบบการอ่านเขียนข้อมูลก่อน เพื่อให้เทคโนโลยีตรงกับเป้าหมายของงาน',
    answer: 'performance-efficiency',
    why: 'Consider mechanical sympathy เป็นหลักของ Performance Efficiency',
  },
]

/** Where the pillar definitions and design principles come from. */
export const WA_SOURCES: { label: string; url: string }[] = [
  {
    label: 'AWS Well-Architected Framework — the pillars',
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html',
  },
  {
    label: 'AWS Well-Architected Tool',
    url: 'https://aws.amazon.com/well-architected-tool/',
  },
]
