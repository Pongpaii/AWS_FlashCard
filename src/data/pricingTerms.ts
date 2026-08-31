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
