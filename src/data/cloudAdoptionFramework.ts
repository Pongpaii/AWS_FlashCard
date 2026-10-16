import type { CafPerspective, ConceptDrillItem } from '../types'

/**
 * AWS Cloud Adoption Framework (AWS CAF) reference for the CLF-C02 exam.
 *
 * Structure follows the AWS CAF overview whitepaper: six perspectives, four
 * transformation domains, and four transformation phases (see `CAF_SOURCES`).
 * The capability lists here are the commonly cited examples per perspective,
 * not the full set of foundational capabilities.
 */

/** Tailwind accents per perspective. */
export const CAF_STYLES: Record<
  string,
  { badge: string; ring: string; soft: string; text: string; dot: string }
> = {
  business: {
    badge: 'bg-amber-500 text-white',
    ring: 'ring-amber-200',
    soft: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  people: {
    badge: 'bg-pink-500 text-white',
    ring: 'ring-pink-200',
    soft: 'bg-pink-50',
    text: 'text-pink-700',
    dot: 'bg-pink-500',
  },
  governance: {
    badge: 'bg-indigo-500 text-white',
    ring: 'ring-indigo-200',
    soft: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
  platform: {
    badge: 'bg-blue-500 text-white',
    ring: 'ring-blue-200',
    soft: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  security: {
    badge: 'bg-red-500 text-white',
    ring: 'ring-red-200',
    soft: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  operations: {
    badge: 'bg-emerald-500 text-white',
    ring: 'ring-emerald-200',
    soft: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
}

/** The six CAF perspectives, in the order the whitepaper lists them. */
export const cafPerspectives: CafPerspective[] = [
  {
    id: 'business',
    name: 'Business',
    nameTh: 'มุมมองธุรกิจ',
    focus: 'ทำให้เงินที่ลงทุนในคลาวด์สร้างผลลัพธ์ทางธุรกิจได้จริง',
    definition:
      'ช่วยให้การลงทุนในคลาวด์เร่งเป้าหมายการเปลี่ยนผ่านดิจิทัลและผลลัพธ์ทางธุรกิจ เชื่อมกลยุทธ์ธุรกิจกับแผนคลาวด์เข้าด้วยกัน',
    stakeholders: ['CEO', 'CFO', 'COO', 'CIO', 'CTO'],
    capabilities: [
      { name: 'Strategy management', th: 'กำหนดกลยุทธ์ว่าคลาวด์จะช่วยธุรกิจตรงไหน' },
      { name: 'Portfolio management', th: 'จัดลำดับความสำคัญของโครงการตามคุณค่าทางธุรกิจ' },
      { name: 'Innovation management', th: 'สร้างกลไกให้เกิดของใหม่ได้เร็วขึ้น' },
      { name: 'Business insights', th: 'ใช้ข้อมูลตอบคำถามธุรกิจได้ทันเวลา' },
    ],
    examTips:
      'ถ้าโจทย์พูดถึง business case, ROI หรือการจัดลำดับความสำคัญของโครงการตามคุณค่าทางธุรกิจ ให้ตอบ Business perspective',
  },
  {
    id: 'people',
    name: 'People',
    nameTh: 'มุมมองคน',
    focus: 'เตรียมคน วัฒนธรรม และทักษะให้พร้อมกับการทำงานบนคลาวด์',
    definition:
      'เป็นสะพานเชื่อมเทคโนโลยีกับธุรกิจ เน้นวัฒนธรรมองค์กร โครงสร้างทีม ภาวะผู้นำ และการยกระดับทักษะของพนักงาน',
    stakeholders: ['CIO', 'COO', 'CTO', 'Cloud director', 'ผู้นำข้ามสายงาน'],
    capabilities: [
      { name: 'Culture evolution', th: 'ปรับวัฒนธรรมให้การเปลี่ยนแปลงเป็นเรื่องปกติ' },
      { name: 'Cloud fluency', th: 'สร้างความรู้คลาวด์ให้พนักงานพูดภาษาเดียวกัน' },
      { name: 'Workforce transformation', th: 'ยกระดับทักษะและปรับบทบาทของทีม' },
      { name: 'Change acceleration', th: 'บริหารการเปลี่ยนแปลงให้คนยอมรับได้เร็ว' },
    ],
    examTips:
      'คำว่าเทรนนิ่ง, upskilling, culture หรือ change management ชี้มาที่ People perspective แทบทุกครั้ง',
  },
  {
    id: 'governance',
    name: 'Governance',
    nameTh: 'มุมมองการกำกับดูแล',
    focus: 'คุมความเสี่ยง งบประมาณ และวัดผลประโยชน์ที่ได้จากคลาวด์',
    definition:
      'ช่วยจัดวางโครงการคลาวด์ให้ได้ประโยชน์สูงสุดและลดความเสี่ยงจากการเปลี่ยนผ่าน ครอบคลุมการบริหารโครงการ ความเสี่ยง และการเงินบนคลาวด์',
    stakeholders: ['Chief transformation officer', 'CIO', 'CTO', 'CFO', 'CDO', 'CRO'],
    capabilities: [
      { name: 'Cloud financial management', th: 'บริหารค่าใช้จ่ายคลาวด์ให้อยู่ในงบและคาดการณ์ได้' },
      { name: 'Risk management', th: 'ระบุและลดความเสี่ยงของการย้ายขึ้นคลาวด์' },
      { name: 'Benefits management', th: 'วัดว่าประโยชน์ที่สัญญาไว้เกิดขึ้นจริงหรือไม่' },
      { name: 'Data governance', th: 'กำหนดกฎการดูแลและใช้ข้อมูลทั้งองค์กร' },
    ],
    examTips:
      'Governance คุมเรื่อง "งบ ความเสี่ยง และการวัดผล" อย่าสับกับ Operations ที่ดูการรันงานประจำวัน',
  },
  {
    id: 'platform',
    name: 'Platform',
    nameTh: 'มุมมองแพลตฟอร์ม',
    focus: 'สร้างแพลตฟอร์มคลาวด์ระดับองค์กรและปรับปรุงระบบเดิมให้ทันสมัย',
    definition:
      'ช่วยสร้างแพลตฟอร์มไฮบริดคลาวด์ที่ขยายตัวได้ระดับองค์กร ปรับปรุง workload เดิมให้ทันสมัย และสร้างระบบใหม่แบบ cloud-native',
    stakeholders: ['CTO', 'ผู้นำสายเทคโนโลยี', 'Architect', 'Engineer'],
    capabilities: [
      { name: 'Platform architecture', th: 'ออกแบบโครงสร้างแพลตฟอร์มมาตรฐานขององค์กร' },
      { name: 'Data architecture', th: 'ออกแบบโครงสร้างข้อมูลให้ใช้งานร่วมกันได้' },
      { name: 'Provisioning and orchestration', th: 'สร้างและจัดการทรัพยากรแบบอัตโนมัติ' },
      { name: 'Modern application development', th: 'พัฒนาแอปแบบใหม่ เช่น container และ serverless' },
      { name: 'Continuous integration and delivery', th: 'วางสายพาน build และ deploy อัตโนมัติ' },
    ],
    examTips:
      'Platform คือ "สร้างของ" ทั้งสถาปัตยกรรม การ provision และการ modernize ส่วน Operations คือ "ดูแลของที่สร้างแล้ว"',
  },
  {
    id: 'security',
    name: 'Security',
    nameTh: 'มุมมองความปลอดภัย',
    focus: 'รักษาความลับ ความถูกต้อง และความพร้อมใช้ของข้อมูลและ workload',
    definition:
      'ช่วยให้บรรลุ confidentiality, integrity และ availability ของข้อมูลและ workload บนคลาวด์ ครอบคลุมตั้งแต่การกำกับดูแลความปลอดภัยจนถึงการรับมือเหตุการณ์',
    stakeholders: ['CISO', 'CCO', 'ผู้นำงานตรวจสอบภายใน', 'Security architect'],
    capabilities: [
      { name: 'Identity and access management', th: 'จัดการตัวตนและสิทธิ์การเข้าถึง' },
      { name: 'Threat detection', th: 'ตรวจจับภัยคุกคามและพฤติกรรมผิดปกติ' },
      { name: 'Vulnerability management', th: 'ค้นหาและปิดช่องโหว่อย่างเป็นระบบ' },
      { name: 'Data protection', th: 'จัดชั้นข้อมูลและเข้ารหัสให้เหมาะกับความอ่อนไหว' },
      { name: 'Incident response', th: 'เตรียมและซ้อมรับมือเหตุการณ์ด้านความปลอดภัย' },
    ],
    examTips:
      'ชื่อ Security ซ้ำกับ pillar ของ Well-Architected อ่านโจทย์ให้ชัดว่าถามถึงกรอบไหน ถ้าโจทย์พูดถึงการเปลี่ยนผ่านองค์กรคือ CAF',
  },
  {
    id: 'operations',
    name: 'Operations',
    nameTh: 'มุมมองการปฏิบัติการ',
    focus: 'ส่งมอบบริการคลาวด์ให้ได้ระดับที่ธุรกิจต้องการในทุกวัน',
    definition:
      'ช่วยให้บริการคลาวด์ถูกส่งมอบในระดับที่ตอบความต้องการของธุรกิจ ครอบคลุมการเฝ้าระวัง การจัดการเหตุขัดข้อง การเปลี่ยนแปลง และความพร้อมใช้',
    stakeholders: ['ผู้นำงาน infrastructure และ operations', 'Site reliability engineer', 'IT service manager'],
    capabilities: [
      { name: 'Event management (AIOps)', th: 'เฝ้าดูเหตุการณ์และแจ้งเตือนอัตโนมัติ' },
      { name: 'Incident and problem management', th: 'จัดการเหตุขัดข้องและหาสาเหตุรากเหง้า' },
      { name: 'Change and release management', th: 'ควบคุมการเปลี่ยนแปลงและการปล่อยเวอร์ชัน' },
      { name: 'Performance and capacity management', th: 'ดูแลประสิทธิภาพและความจุให้พอใช้' },
      { name: 'Availability and continuity management', th: 'ดูแลความพร้อมใช้และแผนความต่อเนื่องธุรกิจ' },
    ],
    examTips:
      'Operations คืองาน day-2 ทั้งหมด เช่น monitoring, incident, patch และ change ถ้าโจทย์พูดถึงการรันระบบประจำวันให้ตอบอันนี้',
  },
]

/** Lookup by perspective id. */
export const cafPerspectiveById: Record<string, CafPerspective> = cafPerspectives.reduce(
  (acc, perspective) => {
    acc[perspective.id] = perspective
    return acc
  },
  {} as Record<string, CafPerspective>,
)

/** The four transformation phases, in order. */
export const cafPhases: { id: string; name: string; nameTh: string; description: string }[] = [
  {
    id: 'envision',
    name: 'Envision',
    nameTh: 'วาดภาพเป้าหมาย',
    description:
      'แสดงให้เห็นว่าคลาวด์จะช่วยเร่งผลลัพธ์ทางธุรกิจได้อย่างไร โดยหาและจัดลำดับโอกาสการเปลี่ยนผ่านให้ตรงกับเป้าหมายเชิงกลยุทธ์ พร้อมจับคู่กับผู้มีส่วนได้ส่วนเสียที่ผลักดันได้',
  },
  {
    id: 'align',
    name: 'Align',
    nameTh: 'จัดแนวให้ตรงกัน',
    description:
      'หาช่องว่างของความสามารถทั้ง 6 perspective หาจุดที่ต้องพึ่งพากันข้ามหน่วยงาน และดึงข้อกังวลของผู้มีส่วนได้ส่วนเสียออกมาคุยกัน',
  },
  {
    id: 'launch',
    name: 'Launch',
    nameTh: 'เริ่มนำร่อง',
    description:
      'ส่งมอบโครงการนำร่องขึ้น production จริงเพื่อพิสูจน์คุณค่าทางธุรกิจเป็นก้อนเล็ก ๆ แล้วเรียนรู้ก่อนขยายผล',
  },
  {
    id: 'scale',
    name: 'Scale',
    nameTh: 'ขยายผล',
    description:
      'ขยายโครงการนำร่องและคุณค่าทางธุรกิจไปสู่ขนาดที่ต้องการ และทำให้ประโยชน์ที่ได้ยั่งยืนต่อเนื่อง',
  },
]

/** The four transformation domains, which form a value chain in this order. */
export const cafDomains: { id: string; name: string; nameTh: string; description: string }[] = [
  {
    id: 'technology',
    name: 'Technology',
    nameTh: 'เทคโนโลยี',
    description: 'ย้ายและปรับปรุงระบบไอทีเดิม รวมถึงสร้างแพลตฟอร์มใหม่บนคลาวด์',
  },
  {
    id: 'process',
    name: 'Process',
    nameTh: 'กระบวนการ',
    description: 'ปรับกระบวนการทำงานและใช้ข้อมูลกับระบบอัตโนมัติมาทำให้การทำงานดีขึ้น',
  },
  {
    id: 'organization',
    name: 'Organization',
    nameTh: 'องค์กร',
    description: 'จัดโครงสร้างทีมและวิธีทำงานใหม่ให้ยึดผลิตภัณฑ์และผลลัพธ์เป็นตัวตั้ง',
  },
  {
    id: 'product',
    name: 'Product',
    nameTh: 'ผลิตภัณฑ์',
    description: 'สร้างรูปแบบธุรกิจใหม่ ผลิตภัณฑ์และบริการใหม่ รวมถึงเข้าตลาดใหม่',
  },
]

/** Memory aids for the CAF structure. */
export const CAF_MNEMONICS: { label: string; value: string; note: string }[] = [
  {
    label: '6 perspectives',
    value: 'B · P · G · P · S · O',
    note: 'Business, People, Governance, Platform, Security, Operations — จำเป็นคู่: สองตัวแรกเรื่องคน สองตัวกลางเรื่องคุมและสร้าง สองตัวท้ายเรื่องปลอดภัยและรันงาน',
  },
  {
    label: '4 phases',
    value: 'Envision → Align → Launch → Scale',
    note: 'ท่องเป็นเรื่องเล่า: ฝันให้เห็นภาพ จัดแนวให้ตรง ลองของจริง แล้วขยายผล',
  },
  {
    label: '4 domains',
    value: 'Technology → Process → Organization → Product',
    note: 'เป็นห่วงโซ่คุณค่า เทคโนโลยีเปิดทางให้กระบวนการ กระบวนการเปิดทางให้องค์กร องค์กรเปิดทางให้ผลิตภัณฑ์',
  },
  {
    label: 'ตัวเลขที่ต้องจำ',
    value: '6 · 4 · 4',
    note: '6 perspectives, 4 transformation domains, 4 transformation phases',
  },
]

/** The distinction the exam tests most often. */
export const CAF_VS_WAF: { aspect: string; caf: string; waf: string }[] = [
  {
    aspect: 'ตอบคำถามอะไร',
    caf: 'องค์กรจะย้ายขึ้นคลาวด์และเปลี่ยนผ่านอย่างไร',
    waf: 'workload นี้ออกแบบมาดีแล้วหรือยัง',
  },
  {
    aspect: 'หน่วยของการมอง',
    caf: 'องค์กรและคน (6 perspectives)',
    waf: 'ระบบหรือ workload (6 pillars)',
  },
  {
    aspect: 'ใครใช้',
    caf: 'ผู้บริหาร ผู้นำโครงการ และทีมเปลี่ยนผ่าน',
    waf: 'สถาปนิกและทีมวิศวกรรม',
  },
  {
    aspect: 'ผลลัพธ์ที่ได้',
    caf: 'แผนการเปลี่ยนผ่านและช่องว่างความสามารถที่ต้องปิด',
    waf: 'รายงานความเสี่ยงเชิงสถาปัตยกรรมและแผนปรับปรุง',
  },
]

/** Cues for the CAF perspective drill. */
export const cafDrillItems: ConceptDrillItem[] = [
  {
    id: 'caf-drill-training',
    cue: 'ทีมไอทียังไม่คุ้นกับ AWS องค์กรจึงวางแผนอบรมและปรับบทบาทของพนักงานก่อนเริ่มย้ายระบบ',
    answer: 'people',
    why: 'การยกระดับทักษะ วัฒนธรรม และการปรับบทบาทอยู่ใน People perspective',
  },
  {
    id: 'caf-drill-budget',
    cue: 'CFO อยากเห็นว่าค่าใช้จ่ายคลาวด์จะถูกคุมและวัดผลประโยชน์ได้อย่างไรก่อนอนุมัติโครงการ',
    answer: 'governance',
    why: 'Cloud financial management และ benefits management อยู่ใน Governance perspective',
  },
  {
    id: 'caf-drill-cicd',
    cue: 'ทีมวิศวกรรมวางสายพาน CI/CD และออกแบบสถาปัตยกรรมแพลตฟอร์มมาตรฐานสำหรับทุกทีม',
    answer: 'platform',
    why: 'การออกแบบและสร้างแพลตฟอร์มรวมถึง CI/CD อยู่ใน Platform perspective',
  },
  {
    id: 'caf-drill-monitoring',
    cue: 'องค์กรตั้งทีมเฝ้าระวังเหตุการณ์ 24 ชั่วโมงและกำหนดขั้นตอนจัดการเหตุขัดข้องกับการเปลี่ยนแปลง',
    answer: 'operations',
    why: 'งาน day-2 อย่าง event, incident และ change management อยู่ใน Operations perspective',
  },
  {
    id: 'caf-drill-roi',
    cue: 'ผู้บริหารต้องการเชื่อมโครงการคลาวด์กับผลลัพธ์ทางธุรกิจและจัดลำดับความสำคัญตาม ROI',
    answer: 'business',
    why: 'Strategy และ portfolio management เพื่อผลลัพธ์ทางธุรกิจอยู่ใน Business perspective',
  },
  {
    id: 'caf-drill-iam',
    cue: 'องค์กรกำหนดนโยบายการให้สิทธิ์ การตรวจจับภัยคุกคาม และแผนรับมือเหตุข้อมูลรั่ว',
    answer: 'security',
    why: 'IAM, threat detection และ incident response อยู่ใน Security perspective ของ CAF',
  },
  {
    id: 'caf-drill-culture',
    cue: 'ผู้นำต้องการให้การเปลี่ยนแปลงเป็นเรื่องปกติในองค์กรและลดแรงต้านจากพนักงาน',
    answer: 'people',
    why: 'Culture evolution และ change acceleration อยู่ใน People perspective',
  },
  {
    id: 'caf-drill-modernize',
    cue: 'ทีมวางแผนแปลงแอปเดิมที่เป็น monolith ให้เป็น container บน AWS',
    answer: 'platform',
    why: 'การ modernize workload เดิมอยู่ใน Platform perspective',
  },
  {
    id: 'caf-drill-risk',
    cue: 'ฝ่ายตรวจสอบขอทะเบียนความเสี่ยงของการย้ายขึ้นคลาวด์และแผนลดความเสี่ยงแต่ละข้อ',
    answer: 'governance',
    why: 'Risk management อยู่ใน Governance perspective',
  },
  {
    id: 'caf-drill-patch',
    cue: 'องค์กรกำหนดรอบการแพตช์และการดูแลความพร้อมใช้ของระบบที่ขึ้น production แล้ว',
    answer: 'operations',
    why: 'Patch management และ availability management อยู่ใน Operations perspective',
  },
]

/** Where the CAF structure comes from. */
export const CAF_SOURCES: { label: string; url: string }[] = [
  {
    label: 'AWS CAF — foundational capabilities',
    url: 'https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/foundational-capabilities.html',
  },
  {
    label: 'AWS CAF — cloud transformation journey',
    url: 'https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/your-cloud-transformation-journey.html',
  },
]
