import type { MatchPair } from '../types'

/**
 * Pricing and billing terms written as match pairs, for the pricing decks in
 * the custom match builder.
 *
 * Discount figures follow the AWS pricing pages: Reserved Instances and Savings
 * Plans save up to 72% versus On-Demand, Spot saves up to 90% (see
 * `PRICING_SOURCES`).
 */

/** Compute purchasing options and the Free Tier. */
export const pricingModelPairs: MatchPair[] = [
  {
    pairId: 'pm-on-demand',
    term: 'On-Demand',
    termSubtitle: 'จ่ายตามการใช้จริง',
    meaning: 'จ่ายเป็นวินาทีหรือชั่วโมงตามที่ใช้ ไม่ผูกสัญญา เหมาะกับงานสั้นหรือคาดการณ์โหลดไม่ได้',
  },
  {
    pairId: 'pm-reserved',
    term: 'Reserved Instances',
    termSubtitle: 'จองล่วงหน้า 1 หรือ 3 ปี',
    meaning: 'คอมมิตใช้ instance แบบเจาะจงนาน 1 หรือ 3 ปี ลดได้ถึง 72% แลกกับความยืดหยุ่นที่น้อยลง',
  },
  {
    pairId: 'pm-savings-plans',
    term: 'Savings Plans',
    termSubtitle: 'คอมมิตเป็นเงินต่อชั่วโมง',
    meaning:
      'คอมมิตค่าใช้จ่ายต่อชั่วโมงนาน 1 หรือ 3 ปี ลดได้ถึง 72% และครอบคลุม EC2, Fargate และ Lambda',
  },
  {
    pairId: 'pm-spot',
    term: 'Spot Instances',
    termSubtitle: 'ใช้กำลังเหลือของ AWS',
    meaning: 'ถูกที่สุด ลดได้ถึง 90% แต่ AWS เรียกคืนเครื่องได้ จึงเหมาะกับงานที่ขัดจังหวะได้',
  },
  {
    pairId: 'pm-dedicated-host',
    term: 'Dedicated Hosts',
    termSubtitle: 'เครื่องจริงทั้งเครื่องของเราคนเดียว',
    meaning: 'เช่าเซิร์ฟเวอร์จริงทั้งเครื่อง ใช้เมื่อมีข้อกำหนดด้าน compliance หรือ license ผูกกับฮาร์ดแวร์',
  },
  {
    pairId: 'pm-free-tier',
    term: 'Free Tier',
    termSubtitle: 'โควตาใช้ฟรี',
    meaning: 'มีทั้งแบบฟรี 12 เดือนแรก แบบฟรีตลอด และแบบทดลองใช้ระยะสั้น',
  },
  {
    pairId: 'pm-savings-flex',
    term: 'Compute Savings Plans',
    termSubtitle: 'ยืดหยุ่นสูงสุดในกลุ่ม Savings Plans',
    meaning: 'ลดราคาข้าม instance family, ขนาด, OS, tenancy และ Region ได้ รวมถึง Fargate กับ Lambda',
  },
]

/** Tools for estimating, watching, and reporting cost. */
export const pricingToolPairs: MatchPair[] = [
  {
    pairId: 'pt-calculator',
    term: 'AWS Pricing Calculator',
    meaning: 'ประมาณค่าใช้จ่ายล่วงหน้าก่อนสร้างทรัพยากรจริง ใช้ทำ business case',
  },
  {
    pairId: 'pt-cost-explorer',
    term: 'AWS Cost Explorer',
    meaning: 'ดูและวิเคราะห์ค่าใช้จ่ายย้อนหลังพร้อมพยากรณ์แนวโน้มไปข้างหน้า',
  },
  {
    pairId: 'pt-budgets',
    term: 'AWS Budgets',
    meaning: 'ตั้งเพดานค่าใช้จ่ายหรือการใช้งาน แล้วแจ้งเตือนเมื่อใกล้หรือเกินงบ',
  },
  {
    pairId: 'pt-cur',
    term: 'AWS Cost and Usage Report',
    meaning: 'ไฟล์รายงานละเอียดที่สุดระดับรายการ ส่งเข้า S3 เพื่อเอาไปวิเคราะห์ต่อ',
  },
  {
    pairId: 'pt-allocation-tags',
    term: 'Cost Allocation Tags',
    meaning: 'ติด tag ทรัพยากรเพื่อแยกค่าใช้จ่ายตามทีม โครงการ หรือสภาพแวดล้อม',
  },
  {
    pairId: 'pt-consolidated',
    term: 'Consolidated Billing',
    meaning: 'รวมบิลทุกบัญชีในองค์กรเป็นใบเดียว และรวมยอดใช้งานเพื่อรับส่วนลดตามปริมาณ',
  },
  {
    pairId: 'pt-trusted-advisor',
    term: 'AWS Trusted Advisor',
    meaning: 'ตรวจบัญชีแล้วเสนอจุดที่ควรปรับ ทั้งด้านต้นทุน ความปลอดภัย และประสิทธิภาพ',
  },
]

/** Billing rules the exam likes to test literally. */
export const pricingRulePairs: MatchPair[] = [
  {
    pairId: 'pr-transfer-in',
    term: 'ข้อมูลเข้า AWS (data transfer in)',
    meaning: 'ไม่มีค่าใช้จ่ายจากอินเทอร์เน็ตเข้ามา',
  },
  {
    pairId: 'pr-transfer-out',
    term: 'ข้อมูลออกจาก AWS (data transfer out)',
    meaning: 'คิดเงินตามปริมาณ และเป็นค่าใช้จ่ายที่คนมักลืมคิดในการประมาณราคา',
  },
  {
    pairId: 'pr-same-az',
    term: 'รับส่งข้อมูลใน AZ เดียวกันผ่าน private IP',
    meaning: 'ไม่มีค่าใช้จ่าย ต่างจากการข้าม AZ หรือข้าม Region ที่คิดเงิน',
  },
  {
    pairId: 'pr-ebs',
    term: 'Amazon EBS',
    meaning: 'คิดตามขนาดที่ provision ไว้ ไม่ใช่ตามที่ใช้จริง ปิดเครื่องแล้ว volume ยังคิดเงิน',
  },
  {
    pairId: 'pr-s3',
    term: 'Amazon S3',
    meaning: 'คิดตามข้อมูลที่เก็บจริง จำนวน request และค่าดึงข้อมูลของ storage class เย็น',
  },
  {
    pairId: 'pr-lambda',
    term: 'AWS Lambda',
    meaning: 'คิดตามจำนวนครั้งที่เรียกและเวลาทำงานคูณหน่วยความจำ ไม่มีเครื่องว่างให้จ่าย',
  },
  {
    pairId: 'pr-glacier',
    term: 'S3 Glacier Deep Archive',
    meaning: 'ค่าเก็บถูกที่สุดแต่ดึงข้อมูลช้าและมีค่าดึง เหมาะกับข้อมูลที่แทบไม่แตะ',
  },
  {
    pairId: 'pr-support-charge',
    term: 'ค่าแผน AWS Support',
    meaning: 'คิดจากค่าขั้นต่ำรายเดือนหรือเปอร์เซ็นต์ของค่าใช้จ่าย แล้วแต่ค่าใดสูงกว่า',
  },
  {
    pairId: 'pr-three-ways',
    term: 'สามวิธีประหยัดของ AWS',
    meaning: 'จ่ายเท่าที่ใช้ · คอมมิตแล้วได้ถูกลง · ใช้มากขึ้นราคาต่อหน่วยถูกลง',
  },
]

/** The three ways AWS frames cloud savings. */
export const PRICING_FUNDAMENTALS: { title: string; en: string; detail: string }[] = [
  {
    title: 'จ่ายเท่าที่ใช้',
    en: 'Pay as you go',
    detail:
      'ไม่ต้องลงทุนล่วงหน้า เปิดใช้เท่าไรจ่ายเท่านั้น ปิดแล้วหยุดจ่าย เปลี่ยนค่าใช้จ่ายจาก CapEx เป็น OpEx',
  },
  {
    title: 'คอมมิตแล้วได้ถูกลง',
    en: 'Save when you commit',
    detail:
      'ผูกสัญญา 1 หรือ 3 ปีด้วย Reserved Instances หรือ Savings Plans เพื่อแลกส่วนลดสูงสุดถึง 72%',
  },
  {
    title: 'ใช้มากขึ้นราคาต่อหน่วยถูกลง',
    en: 'Pay less by using more',
    detail:
      'บริการอย่าง S3 และค่าส่งข้อมูลออกคิดแบบขั้นบันได ยิ่งใช้มากราคาต่อหน่วยยิ่งลด และการรวมบิลทั้งองค์กรช่วยดันยอดรวมให้เข้าขั้นที่ถูกกว่า',
  },
]

/** Comparison rows for the compute purchasing options. */
export const COMPUTE_MODEL_ROWS: {
  model: string
  commitment: string
  discount: string
  interruption: string
  bestFor: string
}[] = [
  {
    model: 'On-Demand',
    commitment: 'ไม่มี',
    discount: 'ราคาเต็ม',
    interruption: 'ไม่ถูกขัดจังหวะ',
    bestFor: 'งานสั้น งานใหม่ที่ยังไม่รู้โหลด หรือ dev/test ที่เปิดปิดบ่อย',
  },
  {
    model: 'Reserved Instances',
    commitment: '1 หรือ 3 ปี ผูกกับ instance ที่เจาะจง',
    discount: 'ถึง 72%',
    interruption: 'ไม่ถูกขัดจังหวะ',
    bestFor: 'โหลดคงที่และรู้แน่ว่าจะใช้ instance แบบนั้นยาว ๆ',
  },
  {
    model: 'Savings Plans',
    commitment: '1 หรือ 3 ปี ผูกกับเงินต่อชั่วโมง',
    discount: 'ถึง 72%',
    interruption: 'ไม่ถูกขัดจังหวะ',
    bestFor: 'โหลดคงที่แต่ยังอยากเปลี่ยน instance family หรือย้ายไป Fargate กับ Lambda ได้',
  },
  {
    model: 'Spot Instances',
    commitment: 'ไม่มี',
    discount: 'ถึง 90%',
    interruption: 'AWS เรียกคืนได้ตลอด',
    bestFor: 'งาน batch, งานประมวลผลที่เริ่มใหม่ได้ หรือ workload ที่ทนการขัดจังหวะ',
  },
  {
    model: 'Dedicated Hosts',
    commitment: 'มีทั้งแบบ On-Demand และแบบจอง',
    discount: 'แพงที่สุดต่อหน่วย',
    interruption: 'ไม่ถูกขัดจังหวะ',
    bestFor: 'ข้อกำหนด compliance หรือ license ที่ผูกกับเซิร์ฟเวอร์จริง',
  },
]

/** The three shapes of the AWS Free Tier. */
export const FREE_TIER_TYPES: { name: string; rule: string; examples: string }[] = [
  {
    name: 'ฟรี 12 เดือนแรก',
    rule: 'นับจากวันเปิดบัญชี หมดอายุแล้วคิดราคาปกติ',
    examples: 'EC2 t2.micro หรือ t3.micro 750 ชั่วโมงต่อเดือน · S3 Standard 5 GB',
  },
  {
    name: 'ฟรีตลอด (Always free)',
    rule: 'ไม่มีวันหมดอายุ แต่มีเพดานการใช้ต่อเดือน',
    examples: 'Lambda 1 ล้าน request ต่อเดือน · DynamoDB พื้นที่เก็บ 25 GB',
  },
  {
    name: 'ทดลองใช้ระยะสั้น (Trials)',
    rule: 'ฟรีเป็นช่วงเวลาสั้น ๆ นับจากวันที่เริ่มใช้บริการนั้น',
    examples: 'บริการเฉพาะทางบางตัวที่ให้ทดลอง 30 หรือ 90 วัน',
  },
]

/** What is free and what is charged, the classic exam trap. */
export const DATA_TRANSFER_RULES: { item: string; charged: boolean; note: string }[] = [
  { item: 'ข้อมูลเข้า AWS จากอินเทอร์เน็ต', charged: false, note: 'ฟรีทุกกรณี' },
  {
    item: 'ข้อมูลออกจาก AWS ไปอินเทอร์เน็ต',
    charged: true,
    note: 'คิดแบบขั้นบันได เป็นค่าใช้จ่ายที่มักถูกลืมตอนประมาณราคา',
  },
  {
    item: 'รับส่งข้อมูลใน AZ เดียวกันผ่าน private IP',
    charged: false,
    note: 'ฟรี จึงควรวางทรัพยากรที่คุยกันบ่อยไว้ AZ เดียวกันถ้าไม่ขัดกับความทนทาน',
  },
  { item: 'รับส่งข้อมูลข้าม AZ ใน Region เดียวกัน', charged: true, note: 'คิดเงินทั้งสองทาง' },
  { item: 'รับส่งข้อมูลข้าม Region', charged: true, note: 'คิดเงินและแพงกว่าข้าม AZ' },
  {
    item: 'ข้อมูลจาก CloudFront ไปผู้ใช้',
    charged: true,
    note: 'คิดในอัตราของ CloudFront ซึ่งถูกกว่าออกจาก EC2 ตรง ๆ',
  },
]

/** Cues for the pricing model drill. */
export const pricingDrillItems: { id: string; cue: string; answer: string; why: string }[] = [
  {
    id: 'pd-batch',
    cue: 'งาน render วิดีโอตอนกลางคืน ถ้าถูกขัดจังหวะกลางทางเริ่มชิ้นนั้นใหม่ได้ ต้องการถูกที่สุด',
    answer: 'spot',
    why: 'ทนการขัดจังหวะได้และเน้นถูกที่สุด คือเงื่อนไขของ Spot Instances ลดได้ถึง 90%',
  },
  {
    id: 'pd-steady-flexible',
    cue: 'โหลดคงที่ 3 ปี แต่ทีมอาจเปลี่ยน instance family และย้ายบางส่วนไป Lambda',
    answer: 'savings-plans',
    why: 'ต้องการส่วนลดจากการคอมมิตพร้อมความยืดหยุ่นข้ามบริการ คือ Compute Savings Plans',
  },
  {
    id: 'pd-steady-fixed',
    cue: 'ฐานข้อมูลรันบน instance รุ่นเดิมตลอด 3 ปี ไม่มีแผนเปลี่ยนสเปกและอยากได้ส่วนลดสูงสุด',
    answer: 'reserved',
    why: 'โหลดคงที่และ instance เจาะจงไม่เปลี่ยน เหมาะกับ Reserved Instances',
  },
  {
    id: 'pd-unknown',
    cue: 'แอปใหม่เพิ่งเปิดตัว ยังไม่รู้ว่าจะมีผู้ใช้เท่าไรและอาจปิดโครงการในสามเดือน',
    answer: 'on-demand',
    why: 'ยังคาดการณ์โหลดไม่ได้และไม่อยากผูกสัญญา จึงใช้ On-Demand',
  },
  {
    id: 'pd-license',
    cue: 'ซอฟต์แวร์ที่ซื้อมามี license ผูกกับจำนวน socket ของเซิร์ฟเวอร์จริง และฝ่ายกำกับต้องการเครื่องแยก',
    answer: 'dedicated-hosts',
    why: 'ข้อกำหนดเรื่อง license ผูกฮาร์ดแวร์และการแยกเครื่อง คือเหตุผลของ Dedicated Hosts',
  },
  {
    id: 'pd-free-tier',
    cue: 'นักศึกษาเพิ่งเปิดบัญชีใหม่ อยากลองรัน EC2 ขนาดเล็ก 750 ชั่วโมงต่อเดือนโดยไม่เสียเงิน',
    answer: 'free-tier',
    why: 'โควตา 750 ชั่วโมงต่อเดือนใน 12 เดือนแรกคือ Free Tier แบบหมดอายุ',
  },
  {
    id: 'pd-spot-fleet',
    cue: 'คลัสเตอร์วิเคราะห์ข้อมูลที่เพิ่มลดเครื่องได้อิสระ และยอมให้บางเครื่องหลุดไปกลางทาง',
    answer: 'spot',
    why: 'ยอมให้เครื่องหลุดได้คือสัญญาณของ Spot Instances',
  },
  {
    id: 'pd-lambda-commit',
    cue: 'องค์กรใช้ Fargate กับ Lambda เป็นหลักและอยากได้ส่วนลดจากการคอมมิตค่าใช้จ่ายรายชั่วโมง',
    answer: 'savings-plans',
    why: 'Reserved Instances ใช้กับ Fargate และ Lambda ไม่ได้ ต้องเป็น Compute Savings Plans',
  },
  {
    id: 'pd-always-free',
    cue: 'ทีมอยากใช้ Lambda ไม่เกิน 1 ล้าน request ต่อเดือนไปเรื่อย ๆ โดยไม่มีค่าใช้จ่าย',
    answer: 'free-tier',
    why: 'โควตานี้อยู่ในกลุ่ม always free ของ Free Tier ที่ไม่มีวันหมดอายุ',
  },
  {
    id: 'pd-short-spike',
    cue: 'แคมเปญ 2 สัปดาห์ที่ต้องการเครื่องเพิ่มชั่วคราวและต้องไม่ถูกเรียกคืนกลางแคมเปญ',
    answer: 'on-demand',
    why: 'ระยะสั้นเกินกว่าจะคอมมิต และห้ามถูกขัดจังหวะ จึงเป็น On-Demand',
  },
]

/** Options shown in the pricing drill. */
export const PRICING_DRILL_OPTIONS: { id: string; label: string; sublabel: string; dot: string }[] =
  [
    { id: 'on-demand', label: 'On-Demand', sublabel: 'จ่ายตามใช้ ไม่ผูกสัญญา', dot: 'bg-sky-500' },
    {
      id: 'reserved',
      label: 'Reserved Instances',
      sublabel: 'จอง instance เจาะจง',
      dot: 'bg-indigo-500',
    },
    {
      id: 'savings-plans',
      label: 'Savings Plans',
      sublabel: 'คอมมิตเงินต่อชั่วโมง',
      dot: 'bg-emerald-500',
    },
    { id: 'spot', label: 'Spot Instances', sublabel: 'ถูกสุด ถูกเรียกคืนได้', dot: 'bg-amber-500' },
    {
      id: 'dedicated-hosts',
      label: 'Dedicated Hosts',
      sublabel: 'เครื่องจริงทั้งเครื่อง',
      dot: 'bg-slate-600',
    },
    { id: 'free-tier', label: 'Free Tier', sublabel: 'โควตาใช้ฟรี', dot: 'bg-teal-500' },
  ]

/** Numbers worth memorising verbatim. */
export const PRICING_NUMBERS: { label: string; value: string }[] = [
  { label: 'Reserved Instances ลดได้ถึง', value: '72%' },
  { label: 'Savings Plans ลดได้ถึง', value: '72%' },
  { label: 'Spot Instances ลดได้ถึง', value: '90%' },
  { label: 'ระยะคอมมิตของ RI และ Savings Plans', value: '1 ปี หรือ 3 ปี' },
  { label: 'Free Tier แบบหมดอายุ', value: '12 เดือนแรกนับจากเปิดบัญชี' },
  { label: 'ค่าขั้นต่ำแผน Developer Support', value: '29 USD ต่อเดือน' },
  { label: 'ค่าขั้นต่ำแผน Business Support', value: '100 USD ต่อเดือน' },
]

/** Where the discount figures come from. */
export const PRICING_SOURCES: { label: string; url: string }[] = [
  { label: 'AWS Savings Plans', url: 'https://aws.amazon.com/savingsplans/' },
  {
    label: 'Amazon EC2 Reserved Instances',
    url: 'https://aws.amazon.com/ec2/pricing/reserved-instances/',
  },
]
