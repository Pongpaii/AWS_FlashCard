import type { MatchPair, ResponsibilityItem, ResponsibilityOwner } from '../types'

/**
 * AWS Shared Responsibility Model study notes for CLF-C02 (Security & Compliance
 * domain). AWS is responsible for security OF the cloud, the customer for
 * security IN the cloud, and where the line falls depends on the service type.
 *
 * Source: AWS Shared Responsibility Model page (see `SRM_SOURCES`).
 */

/** Thai label, short English tag and Tailwind accents per owner. */
export const OWNER_META: Record<
  ResponsibilityOwner,
  { label: string; sublabel: string; dot: string; badge: string; soft: string; text: string }
> = {
  aws: {
    label: 'AWS',
    sublabel: 'Security OF the cloud',
    dot: 'bg-orange-500',
    badge: 'bg-orange-500 text-white',
    soft: 'bg-orange-50 ring-orange-200',
    text: 'text-orange-800',
  },
  customer: {
    label: 'ลูกค้า',
    sublabel: 'Security IN the cloud',
    dot: 'bg-sky-600',
    badge: 'bg-sky-600 text-white',
    soft: 'bg-sky-50 ring-sky-200',
    text: 'text-sky-800',
  },
  shared: {
    label: 'ร่วมกัน',
    sublabel: 'Shared controls',
    dot: 'bg-violet-600',
    badge: 'bg-violet-600 text-white',
    soft: 'bg-violet-50 ring-violet-200',
    text: 'text-violet-800',
  },
}

export const OWNER_IDS: readonly ResponsibilityOwner[] = ['aws', 'customer', 'shared'] as const

/** The two halves of the model, as bullets shown side by side. */
export const SRM_SIDES: { owner: Exclude<ResponsibilityOwner, 'shared'>; title: string; points: string[] }[] = [
  {
    owner: 'aws',
    title: 'AWS รับผิดชอบ “Security OF the cloud”',
    points: [
      'ความปลอดภัยทางกายภาพของ data center: รั้ว ยาม กล้อง การเข้าออกอาคาร',
      'ฮาร์ดแวร์ เซิร์ฟเวอร์ สตอเรจ และอุปกรณ์เครือข่ายที่อยู่เบื้องหลังบริการ',
      'Global infrastructure: Regions, Availability Zones และ edge locations',
      'ซอฟต์แวร์ชั้นล่าง: host OS และ hypervisor (virtualization layer)',
      'การทำลายดิสก์ที่หมดอายุใช้งาน (media decommissioning)',
      'ระบบไฟฟ้า ระบบทำความเย็น และการป้องกันไฟไหม้น้ำท่วม (environmental controls)',
    ],
  },
  {
    owner: 'customer',
    title: 'ลูกค้ารับผิดชอบ “Security IN the cloud”',
    points: [
      'ข้อมูลของลูกค้าเองทั้งหมด รวมถึงการจัดชั้นความลับและการเลือกเข้ารหัส',
      'IAM: ผู้ใช้ กลุ่ม role สิทธิ์ MFA และการหมุน access key',
      'Guest OS บน EC2: แพตช์ อัปเดต และซอฟต์แวร์ที่ติดตั้งเพิ่ม',
      'โค้ดและแอปพลิเคชันที่นำขึ้นไปรัน',
      'การตั้งค่าเครือข่ายและไฟร์วอลล์: security group, network ACL, route table',
      'การเข้ารหัสข้อมูลฝั่ง client, ฝั่ง server และระหว่างทาง (TLS)',
    ],
  },
]

/**
 * Controls the model calls out by name. "Shared" ones mean both sides do the
 * same kind of work, each in its own layer — not that one side can skip it.
 */
export const SRM_CONTROL_TYPES: { name: string; owner: ResponsibilityOwner; detail: string }[] = [
  {
    name: 'Inherited controls',
    owner: 'aws',
    detail:
      'ลูกค้ารับต่อจาก AWS ไปได้เลยโดยไม่ต้องทำอะไร เช่น physical and environmental controls ของ data center',
  },
  {
    name: 'Shared controls',
    owner: 'shared',
    detail:
      'ทั้งสองฝ่ายทำเรื่องเดียวกันแต่คนละชั้น: Patch management, Configuration management และ Awareness & training',
  },
  {
    name: 'Customer specific controls',
    owner: 'customer',
    detail:
      'ลูกค้าทำเองล้วน ๆ ขึ้นกับแอปและบริการที่ใช้ เช่น การกำหนดเส้นทางและแบ่งโซนข้อมูล (zone security) ภายในระบบของตัวเอง',
  },
]

/** The three shared controls, each split into the AWS half and the customer half. */
export const SHARED_CONTROLS: { name: string; aws: string; customer: string }[] = [
  {
    name: 'Patch management',
    aws: 'แพตช์ช่องโหว่ของโครงสร้างพื้นฐาน host OS และ hypervisor',
    customer: 'แพตช์ guest OS และแอปพลิเคชันของตัวเอง',
  },
  {
    name: 'Configuration management',
    aws: 'ดูแลการตั้งค่าอุปกรณ์โครงสร้างพื้นฐาน',
    customer: 'ตั้งค่า guest OS ฐานข้อมูล และแอปพลิเคชันของตัวเอง',
  },
  {
    name: 'Awareness & training',
    aws: 'อบรมพนักงาน AWS',
    customer: 'อบรมพนักงานของตัวเอง',
  },
]

/** Service models along the spectrum, from most to least customer work. */
export const SERVICE_MODELS = [
  { id: 'iaas', label: 'Infrastructure', example: 'EC2, EBS, VPC' },
  { id: 'managed', label: 'Container / managed', example: 'RDS, Elastic Beanstalk, EMR' },
  { id: 'abstracted', label: 'Abstracted', example: 'S3, DynamoDB, Lambda, SQS' },
] as const

export type ServiceModelId = (typeof SERVICE_MODELS)[number]['id']

/** Who does each layer, per service model. The exam lives in these cells. */
export const SERVICE_MODEL_ROWS: {
  layer: string
  owners: Record<ServiceModelId, Exclude<ResponsibilityOwner, 'shared'>>
}[] = [
  { layer: 'Data center ฮาร์ดแวร์ และ hypervisor', owners: { iaas: 'aws', managed: 'aws', abstracted: 'aws' } },
  { layer: 'แพตช์ OS ของเครื่องที่รันบริการ', owners: { iaas: 'customer', managed: 'aws', abstracted: 'aws' } },
  {
    layer: 'แพตช์ database engine / runtime',
    owners: { iaas: 'customer', managed: 'aws', abstracted: 'aws' },
  },
  { layer: 'โค้ดและแอปพลิเคชัน', owners: { iaas: 'customer', managed: 'customer', abstracted: 'customer' } },
  {
    layer: 'สิทธิ์การเข้าถึง (IAM, policy)',
    owners: { iaas: 'customer', managed: 'customer', abstracted: 'customer' },
  },
  {
    layer: 'ข้อมูล และการเลือกเข้ารหัส',
    owners: { iaas: 'customer', managed: 'customer', abstracted: 'customer' },
  },
]

/** Recall items for the "who is responsible" drill. */
export const responsibilityItems: ResponsibilityItem[] = [
  {
    id: 'srm-physical',
    task: 'รักษาความปลอดภัยทางกายภาพของ data center',
    owner: 'aws',
    why: 'ลูกค้าเข้าไปใน data center ของ AWS ไม่ได้อยู่แล้ว เป็นส่วน OF the cloud และเป็น inherited control',
  },
  {
    id: 'srm-hardware',
    task: 'ดูแลและเปลี่ยนฮาร์ดแวร์เซิร์ฟเวอร์ที่เสีย',
    owner: 'aws',
    why: 'ฮาร์ดแวร์เบื้องหลังทุกบริการเป็นของ AWS ลูกค้าไม่เคยแตะเครื่องจริง',
  },
  {
    id: 'srm-hypervisor',
    task: 'แพตช์ hypervisor ที่ใช้รัน EC2',
    owner: 'aws',
    why: 'Hypervisor อยู่ใต้ instance ของลูกค้า เป็นชั้น virtualization ที่ AWS ดูแล',
  },
  {
    id: 'srm-global-infra',
    task: 'ดูแลเครือข่ายระหว่าง Region และ Availability Zone',
    owner: 'aws',
    why: 'Global infrastructure ทั้งหมดเป็นความรับผิดชอบของ AWS',
  },
  {
    id: 'srm-decommission',
    task: 'ทำลายดิสก์เก่าที่เลิกใช้งานอย่างปลอดภัย',
    owner: 'aws',
    why: 'Media decommissioning ทำใน data center ของ AWS ตามมาตรฐานของ AWS',
  },
  {
    id: 'srm-rds-patch',
    task: 'แพตช์ database engine และ OS ของ Amazon RDS',
    owner: 'aws',
    why: 'RDS เป็น managed service AWS แพตช์ให้ ลูกค้าแค่เลือก maintenance window',
  },
  {
    id: 'srm-lambda-runtime',
    task: 'แพตช์ OS และ runtime ที่ Lambda ใช้รันโค้ด',
    owner: 'aws',
    why: 'Lambda เป็นบริการแบบ abstracted ลูกค้าไม่เห็นเซิร์ฟเวอร์เลย',
  },
  {
    id: 'srm-environment',
    task: 'ระบบไฟสำรองและระบบทำความเย็นของ data center',
    owner: 'aws',
    why: 'Environmental controls เป็น inherited control ที่ลูกค้ารับต่อจาก AWS',
  },
  {
    id: 'srm-guest-os',
    task: 'แพตช์ guest OS บน EC2 instance',
    owner: 'customer',
    why: 'EC2 เป็น IaaS ทุกอย่างตั้งแต่ guest OS ขึ้นไปเป็นของลูกค้า AWS ไม่ล็อกอินเข้า instance ให้',
  },
  {
    id: 'srm-sg',
    task: 'ตั้งค่า security group และ network ACL',
    owner: 'customer',
    why: 'AWS ให้เครื่องมือ แต่การเปิดปิดพอร์ตเป็นการตั้งค่าของลูกค้าเอง',
  },
  {
    id: 'srm-iam',
    task: 'สร้าง IAM user, กำหนดสิทธิ์ และบังคับใช้ MFA',
    owner: 'customer',
    why: 'การจัดการตัวตนและสิทธิ์ในบัญชีเป็นของลูกค้าทั้งหมด',
  },
  {
    id: 'srm-data',
    task: 'จัดชั้นความลับของข้อมูลที่เก็บใน S3',
    owner: 'customer',
    why: 'ข้อมูลเป็นของลูกค้าเสมอ ไม่ว่าจะใช้บริการแบบไหน',
  },
  {
    id: 'srm-bucket-policy',
    task: 'ป้องกันไม่ให้ S3 bucket เปิดเป็น public',
    owner: 'customer',
    why: 'Bucket policy และ Block Public Access เป็นการตั้งค่าที่ลูกค้าต้องทำเอง',
  },
  {
    id: 'srm-encrypt',
    task: 'เลือกเปิดการเข้ารหัสข้อมูลที่เก็บใน EBS หรือ RDS',
    owner: 'customer',
    why: 'AWS มี KMS ให้ใช้ แต่การตัดสินใจเข้ารหัสและจัดการสิทธิ์ใช้ key เป็นของลูกค้า',
  },
  {
    id: 'srm-tls',
    task: 'เข้ารหัสข้อมูลระหว่างทางด้วย TLS ในแอปของตัวเอง',
    owner: 'customer',
    why: 'Network traffic protection ฝั่งแอปพลิเคชันเป็นของลูกค้า',
  },
  {
    id: 'srm-app-code',
    task: 'แก้ช่องโหว่ในโค้ดของ Lambda function',
    owner: 'customer',
    why: 'แม้ Lambda จะ serverless โค้ดที่อัปโหลดขึ้นไปก็ยังเป็นของลูกค้า',
  },
  {
    id: 'srm-access-keys',
    task: 'หมุน (rotate) access key ของ IAM user',
    owner: 'customer',
    why: 'Credential ในบัญชีเป็นความรับผิดชอบของลูกค้า',
  },
  {
    id: 'srm-antivirus',
    task: 'ติดตั้งและอัปเดต antivirus บน EC2',
    owner: 'customer',
    why: 'ซอฟต์แวร์ที่ติดตั้งบน guest OS เป็นของลูกค้า',
  },
  {
    id: 'srm-patch-mgmt',
    task: 'Patch management (มองทั้งระบบตั้งแต่ hypervisor ถึงแอป)',
    owner: 'shared',
    why: 'Shared control: AWS แพตช์โครงสร้างพื้นฐาน ลูกค้าแพตช์ guest OS และแอปของตัวเอง',
  },
  {
    id: 'srm-config-mgmt',
    task: 'Configuration management',
    owner: 'shared',
    why: 'Shared control: AWS ตั้งค่าอุปกรณ์โครงสร้างพื้นฐาน ลูกค้าตั้งค่า OS ฐานข้อมูล และแอป',
  },
  {
    id: 'srm-training',
    task: 'Awareness & training ด้านความปลอดภัย',
    owner: 'shared',
    why: 'Shared control: AWS อบรมพนักงาน AWS ลูกค้าอบรมพนักงานของตัวเอง',
  },
]

/** Short exam traps for this topic. */
export const SRM_EXAM_TIPS: string[] = [
  'คำว่า “OF the cloud” = AWS และ “IN the cloud” = ลูกค้า ข้อสอบชอบสลับคำสองคำนี้',
  'ยิ่งบริการ managed มาก AWS ยิ่งรับไปมาก: EC2 ลูกค้าแพตช์ OS เอง แต่ RDS และ Lambda AWS แพตช์ให้',
  'ข้อมูล, IAM และการตั้งค่าสิทธิ์เป็นของลูกค้าเสมอ ทุกบริการ ไม่มีข้อยกเว้น',
  'Shared controls มี 3 ตัวที่ต้องจำ: Patch management, Configuration management, Awareness & training',
  'ถ้าโจทย์ถามหาหลักฐานว่า AWS ทำส่วนของตัวเองครบ เช่นรายงาน SOC/ISO ให้ตอบ AWS Artifact',
]

/** Concept ↔ meaning pairs for the match game. */
export const srmConceptPairs: MatchPair[] = [
  {
    pairId: 'srm-c-of',
    term: 'Security OF the cloud',
    meaning: 'ส่วนที่ AWS รับผิดชอบ: data center ฮาร์ดแวร์ hypervisor และ global infrastructure',
  },
  {
    pairId: 'srm-c-in',
    term: 'Security IN the cloud',
    meaning: 'ส่วนที่ลูกค้ารับผิดชอบ: ข้อมูล IAM guest OS แอป และการตั้งค่าเครือข่าย',
  },
  {
    pairId: 'srm-c-inherited',
    term: 'Inherited controls',
    meaning: 'ลูกค้ารับต่อจาก AWS ไปทั้งหมด เช่น physical and environmental controls',
  },
  {
    pairId: 'srm-c-shared',
    term: 'Shared controls',
    meaning: 'ทั้งสองฝ่ายทำเรื่องเดียวกันคนละชั้น มี 3 ตัว: patch, configuration, training',
  },
  {
    pairId: 'srm-c-customer-specific',
    term: 'Customer specific controls',
    meaning: 'ลูกค้าทำเองล้วน ๆ เช่น การแบ่งโซนและกำหนดเส้นทางข้อมูลภายในระบบตัวเอง',
  },
  {
    pairId: 'srm-c-patch',
    term: 'Patch management',
    meaning: 'AWS แพตช์โครงสร้างพื้นฐาน ลูกค้าแพตช์ guest OS และแอป',
  },
  {
    pairId: 'srm-c-config',
    term: 'Configuration management',
    meaning: 'AWS ตั้งค่าอุปกรณ์โครงสร้างพื้นฐาน ลูกค้าตั้งค่า OS ฐานข้อมูล และแอป',
  },
  {
    pairId: 'srm-c-training',
    term: 'Awareness & training',
    meaning: 'แต่ละฝ่ายอบรมพนักงานของตัวเอง',
  },
  {
    pairId: 'srm-c-artifact',
    term: 'AWS Artifact',
    meaning: 'ที่ดาวน์โหลดรายงาน compliance (SOC, ISO) ที่พิสูจน์ว่า AWS ทำส่วนของตัวเองครบ',
  },
]

/** Service ↔ where the line falls for it. */
export const srmServicePairs: MatchPair[] = [
  {
    pairId: 'srm-s-ec2',
    term: 'Amazon EC2',
    termSubtitle: 'Infrastructure (IaaS)',
    meaning: 'ลูกค้าแพตช์ guest OS ติดตั้งซอฟต์แวร์ และตั้ง security group เอง',
  },
  {
    pairId: 'srm-s-rds',
    term: 'Amazon RDS',
    termSubtitle: 'Managed',
    meaning: 'AWS แพตช์ OS และ database engine ลูกค้าดูแลข้อมูล สิทธิ์ผู้ใช้ DB และการเข้ารหัส',
  },
  {
    pairId: 'srm-s-lambda',
    term: 'AWS Lambda',
    termSubtitle: 'Abstracted',
    meaning: 'AWS ดูแลเซิร์ฟเวอร์และ runtime ลูกค้าดูแลโค้ดและ execution role',
  },
  {
    pairId: 'srm-s-s3',
    term: 'Amazon S3',
    termSubtitle: 'Abstracted',
    meaning: 'AWS ดูแลความทนทานของสตอเรจ ลูกค้าดูแล bucket policy และการเปิด public',
  },
  {
    pairId: 'srm-s-dynamodb',
    term: 'Amazon DynamoDB',
    termSubtitle: 'Abstracted',
    meaning: 'ไม่มีเซิร์ฟเวอร์ให้แพตช์ ลูกค้าดูแลแค่ข้อมูลในตารางและ IAM policy',
  },
  {
    pairId: 'srm-s-beanstalk',
    term: 'AWS Elastic Beanstalk',
    termSubtitle: 'Managed',
    meaning: 'AWS จัดการแพลตฟอร์มและอัปเดตให้ได้ ลูกค้าดูแลโค้ดแอปที่อัปโหลด',
  },
]

/** Where the content on this page comes from. */
export const SRM_SOURCES: { label: string; url: string }[] = [
  {
    label: 'AWS Shared Responsibility Model',
    url: 'https://aws.amazon.com/compliance/shared-responsibility-model/',
  },
]
