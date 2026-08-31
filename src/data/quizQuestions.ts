import type { QuizDomain, QuizDomainFilter, QuizQuestion } from '../types'
import { QUIZ_DOMAINS } from '../types'

/**
 * Scenario-based practice questions written for this app.
 *
 * These are ORIGINAL questions authored in the style of the CLF-C02 exam
 * blueprint. They are deliberately not copied from real exam material, which is
 * confidential, and not taken from dump sites, which are frequently wrong.
 * Every answer is grounded in documented AWS behaviour.
 */
export const quizQuestions: QuizQuestion[] = [
  // ----------------------------------------------------- Cloud Concepts (13)
  {
    id: 'cc-capex-opex',
    domain: 'Cloud Concepts',
    scenario:
      'สตาร์ทอัพแห่งหนึ่งเคยต้องซื้อเซิร์ฟเวอร์ล่วงหน้าเป็นเงินก้อนใหญ่ก่อนเปิดบริการทุกครั้ง หลังย้ายมาใช้ AWS ทีมจ่ายเฉพาะทรัพยากรที่ใช้จริงในแต่ละเดือน',
    question: 'การเปลี่ยนแปลงนี้ตรงกับข้อได้เปรียบของคลาวด์ข้อใดมากที่สุด',
    choices: [
      'แลกค่าใช้จ่ายลงทุนล่วงหน้า (CapEx) เป็นค่าใช้จ่ายผันแปรตามการใช้ (OpEx)',
      'ได้ประโยชน์จากการประหยัดต่อขนาด (economies of scale)',
      'ขยายบริการไปทั่วโลกได้ในไม่กี่นาที',
      'เลิกเดาความจุที่ต้องใช้ (stop guessing capacity)',
    ],
    correctIndex: 0,
    explanation:
      'ใจความของโจทย์คือ "ไม่ต้องจ่ายก้อนใหญ่ล่วงหน้า แต่จ่ายตามที่ใช้" ซึ่งตรงกับการแลก CapEx เป็น OpEx โดยตรง ข้ออื่นเป็นข้อได้เปรียบของคลาวด์จริงแต่ไม่ใช่สิ่งที่โจทย์บรรยาย: economies of scale คือราคาต่อหน่วยถูกลงเพราะ AWS ซื้อในปริมาณมหาศาล, การขยายทั่วโลกเน้นเรื่องพื้นที่ให้บริการ, และ stop guessing capacity เน้นเรื่องการปรับขนาดตามโหลด',
    relatedServices: ['free-tier', 'pricing-calculator'],
  },
  {
    id: 'cc-elasticity',
    domain: 'Cloud Concepts',
    scenario:
      'เว็บขายสินค้ามีทราฟฟิกพุ่งสูงมากเฉพาะช่วงแฟลชเซล 2 ชั่วโมง นอกเวลานั้นทราฟฟิกต่ำมาก ทีมต้องการให้จำนวนเซิร์ฟเวอร์เพิ่มขึ้นเองตอนคนเยอะและลดลงเองตอนคนน้อย เพื่อไม่ให้จ่ายเกินจำเป็น',
    question: 'คุณสมบัติของคลาวด์ข้อใดที่โจทย์นี้กำลังพูดถึง',
    choices: [
      'Elasticity',
      'High availability',
      'Fault tolerance',
      'Agility',
    ],
    correctIndex: 0,
    explanation:
      'Elasticity คือความสามารถเพิ่มและลดทรัพยากรตามโหลดจริงแบบอัตโนมัติ ซึ่งตรงกับโจทย์ที่เน้นทั้ง "เพิ่มเองตอนคนเยอะ" และ "ลดเองตอนคนน้อยเพื่อประหยัด" High availability คือระบบยังให้บริการได้เมื่อบางส่วนล่ม, fault tolerance คือทนต่อความล้มเหลวโดยไม่กระทบผู้ใช้, agility คือความเร็วในการทดลองและออกฟีเจอร์ใหม่',
    relatedServices: ['ec2', 'elb', 'cloudwatch'],
  },
  {
    id: 'cc-multi-az',
    domain: 'Cloud Concepts',
    scenario:
      'แอปพลิเคชันรันบน EC2 เครื่องเดียวใน Availability Zone เดียว ทีมต้องการให้ระบบยังให้บริการต่อได้ถ้า data center แห่งนั้นมีปัญหา โดยยังอยู่ใน Region เดิมและควบคุมค่าใช้จ่ายไม่ให้บานปลาย',
    question: 'ควรออกแบบอย่างไร',
    choices: [
      'กระจาย instance ไปหลาย Availability Zone แล้ววาง Load Balancer ไว้ด้านหน้า',
      'ย้ายไปใช้ instance type ที่ใหญ่ขึ้นเพื่อให้ทนโหลดได้มากกว่า',
      'ทำสำเนาระบบทั้งชุดไปอีก 3 Region ทั่วโลก',
      'เปิดใช้ CloudFront edge location ให้ครอบคลุมทุกทวีป',
    ],
    correctIndex: 0,
    explanation:
      'AZ แต่ละแห่งคือกลุ่ม data center ที่แยกกันทางกายภาพภายใน Region เดียว การกระจายข้าม AZ พร้อม Load Balancer จึงตอบโจทย์ "รอด AZ ล่ม" โดยยังอยู่ Region เดิม เครื่องที่ใหญ่ขึ้นไม่ได้ช่วยเลยถ้า AZ นั้นล่มทั้งโซน การทำ multi-Region ช่วยได้แต่เกินความต้องการและแพงกว่ามาก ส่วน CloudFront เป็น CDN ที่ช่วยลด latency ไม่ใช่กลไก HA ของ compute',
    relatedServices: ['ec2', 'elb', 'vpc'],
  },
  {
    id: 'cc-well-architected-reliability',
    domain: 'Cloud Concepts',
    scenario:
      'ทีมสถาปนิกกำลังทบทวนระบบตาม AWS Well-Architected Framework ประเด็นที่ทบทวนคือระบบต้องกู้คืนจากความล้มเหลวได้เองโดยอัตโนมัติ และต้องทดสอบขั้นตอนการกู้คืนอย่างสม่ำเสมอ',
    question: 'ประเด็นนี้อยู่ในเสาหลัก (pillar) ใด',
    choices: [
      'Reliability',
      'Operational Excellence',
      'Performance Efficiency',
      'Cost Optimization',
    ],
    correctIndex: 0,
    explanation:
      'เสา Reliability ว่าด้วยความสามารถของระบบในการทำงานตามที่คาดหวังและกู้คืนจากความล้มเหลว รวมถึงการทดสอบ recovery Operational Excellence เน้นการรันและปรับปรุงกระบวนการปฏิบัติงาน, Performance Efficiency เน้นการใช้ทรัพยากรอย่างมีประสิทธิภาพตามโหลด, Cost Optimization เน้นการเลี่ยงค่าใช้จ่ายที่ไม่จำเป็น',
  },
  {
    id: 'cc-hybrid',
    domain: 'Cloud Concepts',
    scenario:
      'ธนาคารต้องเก็บระบบ core banking ไว้ใน data center ของตัวเองตามข้อกำหนดกำกับดูแล แต่ต้องการย้ายระบบวิเคราะห์ข้อมูลและเว็บลูกค้าขึ้น AWS โดยสองฝั่งต้องเชื่อมต่อกันได้',
    question: 'รูปแบบการใช้งานคลาวด์นี้เรียกว่าอะไร',
    choices: [
      'Hybrid cloud',
      'Cloud-native',
      'Multi-cloud',
      'Private cloud',
    ],
    correctIndex: 0,
    explanation:
      'Hybrid cloud คือการใช้ทรัพยากร on-premises ร่วมกับคลาวด์และเชื่อมต่อถึงกัน ตรงกับโจทย์ Cloud-native หมายถึงสร้างทุกอย่างบนคลาวด์ตั้งแต่ต้น, multi-cloud คือใช้ผู้ให้บริการคลาวด์หลายเจ้าพร้อมกัน, private cloud คือคลาวด์ที่ใช้เฉพาะองค์กรเดียวโดยไม่มีส่วนสาธารณะ',
    relatedServices: ['direct-connect', 'site-to-site-vpn', 'outposts', 'storage-gateway'],
  },
  {
    id: 'cc-serverless',
    domain: 'Cloud Concepts',
    scenario:
      'ทีมพัฒนาต้องการเขียนฟังก์ชันประมวลผลรูปภาพที่ทำงานเมื่อมีไฟล์อัปโหลดเข้ามา โดยไม่ต้องดูแล patch ระบบปฏิบัติการ ไม่ต้องตั้ง Auto Scaling และไม่ต้องจ่ายเงินเลยเมื่อไม่มีใครอัปโหลด',
    question: 'ควรเลือกใช้บริการใด',
    choices: [
      'AWS Lambda',
      'Amazon EC2 พร้อม Auto Scaling group',
      'AWS Elastic Beanstalk',
      'Amazon Lightsail',
    ],
    correctIndex: 0,
    explanation:
      'Lambda เป็น serverless compute ที่ทำงานตาม event สเกลเอง และไม่คิดเงินเมื่อไม่ถูกเรียก จึงตรงทุกเงื่อนไข EC2 และ Beanstalk ยังมีเซิร์ฟเวอร์ที่ต้องดูแลและเสียเงินตามเวลาที่เครื่องเปิดอยู่แม้ไม่มีทราฟฟิก Lightsail เป็น VPS ราคาคงที่รายเดือน จึงมีค่าใช้จ่ายตลอดเช่นกัน',
    relatedServices: ['lambda', 's3', 'ec2', 'elastic-beanstalk'],
  },
  {
    id: 'cc-agility',
    domain: 'Cloud Concepts',
    scenario:
      'เดิมทีมต้องรอฝ่ายจัดซื้อและติดตั้งเซิร์ฟเวอร์ราว 3 เดือนก่อนจะเริ่มทดลองไอเดียใหม่ได้ หลังใช้ AWS ทีมสร้างสภาพแวดล้อมทดลองได้ในไม่กี่นาที ถ้าไอเดียไม่เวิร์กก็ลบทิ้งได้ทันที',
    question: 'ข้อได้เปรียบข้อใดอธิบายสถานการณ์นี้ได้ตรงที่สุด',
    choices: [
      'ความคล่องตัวในการทดลองและล้มเหลวได้ด้วยต้นทุนต่ำ (agility)',
      'ความทนทานต่อความล้มเหลวของฮาร์ดแวร์',
      'การประหยัดต่อขนาด',
      'ความปลอดภัยที่สูงขึ้นโดยอัตโนมัติ',
    ],
    correctIndex: 0,
    explanation:
      'โจทย์เน้นเวลาที่ใช้ตั้งแต่คิดจนได้ทดลอง ลดจาก 3 เดือนเหลือไม่กี่นาที และการยกเลิกได้ทันที นี่คือ agility ข้ออื่นไม่เกี่ยวกับความเร็วในการทดลอง',
  },
  {
    id: 'cc-wa-pillar-count',
    domain: 'Cloud Concepts',
    scenario:
      'ผู้จัดการโครงการเพิ่งได้ยินเรื่อง AWS Well-Architected Framework จากทีมสถาปนิก และอยากรู้ว่ากรอบนี้ประกอบด้วยเสาหลักอะไรบ้าง',
    question: 'ข้อใดคือรายชื่อ pillar ของ AWS Well-Architected Framework',
    choices: [
      'Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability',
      'Security, Compliance, Reliability, Scalability, Cost Optimization, Automation',
      'People, Process, Platform, Security, Governance, Operations',
      'Availability, Durability, Reliability, Security, Performance, Cost',
    ],
    correctIndex: 0,
    explanation:
      'Well-Architected Framework มี 6 pillar คือ Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization และ Sustainability ซึ่ง Sustainability เพิ่มเข้ามาเป็นตัวที่ 6 ในปี 2021 ตัวเลือกที่มี People, Process, Platform เป็นชุด perspective ของ AWS Cloud Adoption Framework (CAF) ซึ่งเป็นกรอบต่างเรื่องกัน ส่วนตัวเลือกอื่นเป็นคำที่ฟังดูคุ้นแต่ไม่ใช่ชื่อ pillar',
  },
  {
    id: 'cc-wa-sustainability',
    domain: 'Cloud Concepts',
    scenario:
      'ฝ่าย ESG ขอให้ทีมเทคโนโลยีลดผลกระทบต่อสิ่งแวดล้อมจากการรันระบบบน AWS โดยเสนอให้ปิดทรัพยากรที่นิ่งเฉย ใช้ managed service มากขึ้น และย้ายไปใช้ฮาร์ดแวร์รุ่นที่ประหยัดพลังงานกว่า',
    question: 'ข้อเสนอเหล่านี้อยู่ใน pillar ใด',
    choices: ['Sustainability', 'Cost Optimization', 'Operational Excellence', 'Reliability'],
    correctIndex: 0,
    explanation:
      'ทั้งสามข้อเสนอตรงกับหลักของ Sustainability คือ Maximize utilization, Use managed services และ Anticipate and adopt new, more efficient hardware and software offerings จุดตัดสินคือโจทย์วัดผลด้วยผลกระทบต่อสิ่งแวดล้อม ไม่ใช่จำนวนเงินที่ประหยัด ถ้าโจทย์วัดผลด้วยเงินคำตอบจะเป็น Cost Optimization',
  },
  {
    id: 'cc-wa-operational-excellence',
    domain: 'Cloud Concepts',
    scenario:
      'ทีมเปลี่ยนมานิยาม infrastructure ทั้งหมดเป็นเทมเพลตโค้ด ปล่อยการเปลี่ยนแปลงเป็นชุดเล็ก ๆ ที่ย้อนกลับได้ และทบทวน runbook ทุกไตรมาสหลังเกิดเหตุขัดข้อง',
    question: 'แนวทางนี้สะท้อน pillar ใดมากที่สุด',
    choices: ['Operational Excellence', 'Reliability', 'Security', 'Performance Efficiency'],
    correctIndex: 0,
    explanation:
      'การทำงานเป็นโค้ด การเปลี่ยนแบบเล็กและย้อนกลับได้ และการขัดเกลาขั้นตอนปฏิบัติงาน ตรงกับหลัก Safely automate where possible, Make frequent small reversible changes และ Refine operations procedures frequently ของ Operational Excellence Reliability จะเน้นว่าระบบยังให้บริการได้และกู้คืนได้ ซึ่งเป็นเป้าหมายต่างกัน',
    relatedServices: ['cloudformation', 'systems-manager', 'cloudwatch'],
  },
  {
    id: 'cc-wa-performance-vs-reliability',
    domain: 'Cloud Concepts',
    scenario:
      'ผู้ใช้ในเอเชียบ่นว่าเว็บโหลดช้าเพราะเซิร์ฟเวอร์อยู่ที่อเมริกา ทีมจึงวางแผนใช้ CDN และขยายไปหลาย Region เพื่อลด latency',
    question: 'แผนนี้อยู่ใน pillar ใด',
    choices: [
      'Performance Efficiency',
      'Reliability',
      'Operational Excellence',
      'Cost Optimization',
    ],
    correctIndex: 0,
    explanation:
      'เป้าหมายของโจทย์คือความเร็วและ latency ซึ่งเป็น Performance Efficiency ตรงกับหลัก Go global in minutes ถ้าโจทย์บอกว่าต้องการให้ระบบยังใช้งานได้เมื่อ Region หนึ่งล่ม คำตอบจะเปลี่ยนเป็น Reliability แม้จะใช้เทคนิค multi-Region เหมือนกัน',
    relatedServices: ['cloudfront', 'global-accelerator', 'route-53'],
  },
  {
    id: 'cc-wa-tool',
    domain: 'Cloud Concepts',
    scenario:
      'ทีมต้องการประเมินว่า workload ที่รันอยู่สอดคล้องกับแนวปฏิบัติที่ดีของ AWS มากน้อยเพียงใด โดยตอบชุดคำถามตาม pillar แล้วได้รายงานความเสี่ยงพร้อมแผนปรับปรุง และไม่ต้องการเสียค่าบริการเพิ่ม',
    question: 'ควรใช้เครื่องมือใด',
    choices: [
      'AWS Well-Architected Tool',
      'AWS Config',
      'AWS Artifact',
      'AWS Systems Manager',
    ],
    correctIndex: 0,
    explanation:
      'AWS Well-Architected Tool อยู่ใน Management Console ใช้ฟรี ให้ตอบคำถามตาม pillar แล้วออกรายงานความเสี่ยงพร้อมแผนปรับปรุง และเลือก lens เฉพาะทางได้ AWS Config ติดตามการเปลี่ยนแปลงการตั้งค่าและตรวจ compliance ตามกฎที่กำหนด Artifact เป็นที่ดาวน์โหลดรายงาน compliance ของ AWS Systems Manager ใช้จัดการและสั่งงานเครื่องจำนวนมาก',
    relatedServices: ['trusted-advisor', 'config', 'artifact', 'systems-manager'],
  },
  {
    id: 'cc-wa-mechanical-sympathy',
    domain: 'Cloud Concepts',
    scenario:
      'ในการทบทวนสถาปัตยกรรม ทีมตัดสินใจเลือกชนิดฐานข้อมูลและประเภท storage โดยดูรูปแบบการอ่านเขียนข้อมูลจริงก่อน เพื่อให้เทคโนโลยีที่เลือกตรงกับเป้าหมายของงาน',
    question: 'แนวคิดนี้ตรงกับ design principle ข้อใด',
    choices: [
      'Consider mechanical sympathy ใน Performance Efficiency',
      'Stop guessing capacity ใน Reliability',
      'Adopt a consumption model ใน Cost Optimization',
      'Apply security at all layers ใน Security',
    ],
    correctIndex: 0,
    explanation:
      'Consider mechanical sympathy คือการเข้าใจวิธีที่บริการคลาวด์ถูกใช้งานแล้วเลือกเทคโนโลยีให้ตรงกับเป้าหมายของ workload เช่นดู data access pattern ก่อนเลือกฐานข้อมูล อยู่ใน Performance Efficiency Stop guessing capacity คือเลิกเดาความจุแล้วปรับตามความต้องการจริงซึ่งอยู่ใน Reliability ส่วนอีกสองข้ออยู่ต่าง pillar และต่างเป้าหมาย',
    relatedServices: ['dynamodb', 'rds', 'ebs', 's3'],
  },

  // ------------------------------------------------- Security & Compliance (8)
  {
    id: 'sec-shared-guest-os',
    domain: 'Security & Compliance',
    scenario:
      'บริษัทรัน Linux อยู่บน Amazon EC2 ผู้ตรวจสอบถามว่าใครมีหน้าที่ติดตั้งแพตช์ความปลอดภัยให้ระบบปฏิบัติการภายใน instance เหล่านั้น',
    question: 'ตามโมเดล Shared Responsibility คำตอบคือใคร',
    choices: [
      'ลูกค้า เพราะ guest OS อยู่ในความรับผิดชอบของลูกค้า',
      'AWS เพราะ AWS ดูแลโครงสร้างพื้นฐานทั้งหมด',
      'รับผิดชอบร่วมกันคนละครึ่ง',
      'ผู้ให้บริการระบบปฏิบัติการต้นทาง',
    ],
    correctIndex: 0,
    explanation:
      'หลักจำง่ายคือ AWS รับผิดชอบ "security OF the cloud" (ฮาร์ดแวร์, ศูนย์ข้อมูล, virtualization layer) ส่วนลูกค้ารับผิดชอบ "security IN the cloud" ซึ่งรวม guest OS, แพตช์, แอปพลิเคชัน, การตั้งค่า security group และข้อมูลของตัวเอง หมายเหตุ: สำหรับบริการ managed อย่าง RDS หรือ Lambda การแพตช์ OS เป็นหน้าที่ของ AWS แต่โจทย์นี้เป็น EC2',
    relatedServices: ['ec2', 'systems-manager', 'inspector'],
  },
  {
    id: 'sec-shared-physical',
    domain: 'Security & Compliance',
    scenario:
      'ทีมความปลอดภัยขอเข้าตรวจ data center ของ AWS เพื่อยืนยันการควบคุมการเข้าถึงทางกายภาพด้วยตัวเอง แต่ถูกปฏิเสธ',
    question: 'เพราะเหตุใด และลูกค้าจะยืนยันการควบคุมเหล่านั้นได้อย่างไร',
    choices: [
      'ความปลอดภัยทางกายภาพเป็นหน้าที่ของ AWS ลูกค้าตรวจสอบผ่านรายงานใน AWS Artifact ได้',
      'ต้องยื่นคำขอผ่าน AWS Support แผน Enterprise ก่อนจึงจะเข้าตรวจได้',
      'เข้าตรวจได้เฉพาะ Region ที่ลูกค้ามีทรัพยากรอยู่',
      'ความปลอดภัยทางกายภาพเป็นหน้าที่ลูกค้า จึงต้องจ้างผู้ตรวจภายนอกเอง',
    ],
    correctIndex: 0,
    explanation:
      'ลูกค้าไม่สามารถเข้า data center ของ AWS ได้ เพราะความปลอดภัยทางกายภาพอยู่ฝั่ง AWS ตามโมเดล Shared Responsibility วิธียืนยันคือดาวน์โหลดรายงานการรับรองอย่าง SOC, ISO 27001 หรือ PCI DSS จาก AWS Artifact ซึ่งใช้ฟรี ไม่มีแผน support ใดที่ให้สิทธิ์เข้าตรวจสถานที่',
    relatedServices: ['artifact', 'support-plans'],
  },
  {
    id: 'sec-root-user',
    domain: 'Security & Compliance',
    scenario:
      'บัญชี AWS ใหม่ถูกสร้างขึ้น และทีมกำลังใช้ root user ทำงานประจำวันทั้งหมด รวมถึงแชร์รหัสผ่าน root ให้สมาชิกหลายคน',
    question: 'ข้อใดเป็นแนวปฏิบัติที่ควรทำที่สุด',
    choices: [
      'เปิด MFA ให้ root user เก็บ credential ไว้อย่างปลอดภัย และสร้าง IAM user หรือ role สำหรับงานประจำวัน',
      'เปลี่ยนรหัสผ่าน root ให้ยาวขึ้นแล้วใช้งานร่วมกันต่อได้',
      'สร้าง access key ของ root แล้วแจกให้แต่ละคนใช้แยกกัน',
      'ลบ root user ทิ้งหลังตั้งค่าบัญชีเสร็จ',
    ],
    correctIndex: 0,
    explanation:
      'root user มีสิทธิ์ทำได้ทุกอย่างในบัญชีและจำกัดด้วย IAM policy ไม่ได้ จึงควรเปิด MFA เก็บ credential ให้ปลอดภัย และไม่ใช้ทำงานประจำ การแชร์รหัสผ่านหรือแจก access key ของ root ยิ่งเพิ่มความเสี่ยงและทำให้ตรวจสอบย้อนหลังไม่ได้ว่าใครทำอะไร และ root user ลบไม่ได้เพราะผูกกับตัวบัญชี',
    relatedServices: ['iam', 'iam-identity-center', 'cloudtrail'],
  },
  {
    id: 'sec-waf-vs-shield',
    domain: 'Security & Compliance',
    scenario:
      'เว็บแอปที่วางอยู่หลัง Application Load Balancer ถูกโจมตีด้วย SQL injection และ cross-site scripting ผ่าน HTTP request ทีมต้องการกรองคำขอที่เป็นอันตรายเหล่านี้',
    question: 'ควรใช้บริการใด',
    choices: [
      'AWS WAF',
      'AWS Shield Standard',
      'Amazon GuardDuty',
      'AWS Network Firewall',
    ],
    correctIndex: 0,
    explanation:
      'SQL injection และ XSS เป็นการโจมตีระดับแอปพลิเคชัน (layer 7) ซึ่ง AWS WAF ออกแบบมาเพื่อกรองโดยเฉพาะ และวางหน้า ALB, CloudFront หรือ API Gateway ได้ Shield เน้นป้องกัน DDoS ที่ layer 3/4 GuardDuty เป็นการตรวจจับภัยคุกคามจาก log ไม่ได้บล็อกคำขอ',
    relatedServices: ['waf', 'shield', 'elb', 'guardduty'],
  },
  {
    id: 'sec-cloudtrail-audit',
    domain: 'Security & Compliance',
    scenario:
      'S3 bucket สำคัญถูกลบไปเมื่อสัปดาห์ก่อน ผู้บริหารต้องการรู้ว่าใครเป็นผู้เรียก API ลบ bucket นั้น เรียกจาก IP ใด และเวลาใด',
    question: 'ควรดูข้อมูลจากบริการใด',
    choices: [
      'AWS CloudTrail',
      'Amazon CloudWatch metrics',
      'AWS Config',
      'AWS Trusted Advisor',
    ],
    correctIndex: 0,
    explanation:
      'CloudTrail บันทึกทุก API call ในบัญชีพร้อมข้อมูลว่าใครเรียก จากที่ไหน เมื่อไร จึงเป็นเครื่องมือสำหรับสืบสวนย้อนหลัง จำหลักสั้น ๆ ว่า CloudTrail = "ใครทำอะไร" ส่วน CloudWatch = "ระบบเป็นอย่างไร" AWS Config บอกว่าการตั้งค่าเปลี่ยนไปอย่างไรแต่ไม่เน้นตัวผู้กระทำ Trusted Advisor ให้คำแนะนำการปรับปรุงบัญชี',
    relatedServices: ['cloudtrail', 'cloudwatch', 'config', 's3'],
  },
  {
    id: 'sec-macie-pii',
    domain: 'Security & Compliance',
    scenario:
      'องค์กรเก็บไฟล์จำนวนมากใน Amazon S3 และต้องการรู้ว่ามี bucket ใดเก็บข้อมูลส่วนบุคคลหรือเลขบัตรเครดิตอยู่โดยไม่ได้ตั้งใจ',
    question: 'บริการใดตอบโจทย์นี้ตรงที่สุด',
    choices: [
      'Amazon Macie',
      'Amazon Inspector',
      'Amazon GuardDuty',
      'AWS Security Hub',
    ],
    correctIndex: 0,
    explanation:
      'Macie ใช้ machine learning ค้นหาและจัดประเภทข้อมูลอ่อนไหวเช่น PII และข้อมูลบัตรเครดิตใน S3 โดยเฉพาะ Inspector สแกนช่องโหว่ของ EC2, container image และ Lambda GuardDuty ตรวจจับพฤติกรรมน่าสงสัยจาก log Security Hub รวบรวมผลจากบริการอื่นมาแสดงในที่เดียว',
    relatedServices: ['macie', 'inspector', 'guardduty', 'security-hub', 's3'],
  },
  {
    id: 'sec-secrets-rotation',
    domain: 'Security & Compliance',
    scenario:
      'แอปพลิเคชันเก็บรหัสผ่านฐานข้อมูลไว้ในไฟล์คอนฟิกในโค้ด ทีมต้องการย้ายไปเก็บที่ปลอดภัยกว่า และต้องการให้รหัสผ่านถูกหมุนเวียนเปลี่ยนใหม่โดยอัตโนมัติตามรอบเวลา',
    question: 'ควรใช้บริการใด',
    choices: [
      'AWS Secrets Manager',
      'AWS Systems Manager Parameter Store แบบ String ทั่วไป',
      'AWS Key Management Service',
      'Amazon S3 bucket ที่เปิดการเข้ารหัส',
    ],
    correctIndex: 0,
    explanation:
      'คำใบ้ที่ชี้ชัดคือ "หมุนเวียนรหัสผ่านอัตโนมัติ" ซึ่งเป็นฟีเจอร์ของ Secrets Manager และผสานกับ RDS ได้ Parameter Store เก็บค่าคอนฟิกและ secret ได้ (มี SecureString) แต่ไม่มี rotation อัตโนมัติในตัว KMS จัดการกุญแจเข้ารหัส ไม่ได้เก็บตัว secret เอง การเก็บไฟล์ใน S3 ไม่ตอบเรื่องการหมุนเวียน',
    relatedServices: ['secrets-manager', 'systems-manager', 'kms', 'rds'],
  },
  {
    id: 'sec-iam-least-privilege',
    domain: 'Security & Compliance',
    scenario:
      'พนักงานใหม่เข้ามาดูแลเฉพาะการอ่านไฟล์รายงานใน S3 bucket เดียว แต่ถูกมอบ policy ที่ให้สิทธิ์ AdministratorAccess ไปก่อนเพื่อความสะดวก',
    question: 'ข้อใดคือหลักการที่ถูกละเมิด และควรแก้อย่างไร',
    choices: [
      'ละเมิดหลัก least privilege ควรให้สิทธิ์เท่าที่จำเป็นคืออ่านเฉพาะ bucket นั้น',
      'ละเมิดหลัก defense in depth ควรเพิ่มไฟร์วอลล์อีกชั้น',
      'ไม่ได้ละเมิดอะไร เพราะ IAM policy แก้ทีหลังได้ตลอด',
      'ละเมิดหลักการแยกหน้าที่ ควรย้ายผู้ใช้ไปอีกบัญชีหนึ่ง',
    ],
    correctIndex: 0,
    explanation:
      'least privilege คือการให้สิทธิ์เพียงเท่าที่จำเป็นต่อการทำงาน การให้ AdministratorAccess กับคนที่ต้องอ่านไฟล์อย่างเดียวเปิดความเสี่ยงเกินจำเป็น ทางแก้คือเขียน policy ที่อนุญาตเฉพาะ action อ่านบน resource นั้น การเพิ่มไฟร์วอลล์หรือย้ายบัญชีไม่ได้แก้ต้นเหตุเรื่องสิทธิ์',
    relatedServices: ['iam', 's3'],
  },

  // ------------------------------------------------------------ Technology (9)
  {
    id: 'tech-static-site',
    domain: 'Technology',
    scenario:
      'ทีมการตลาดต้องการโฮสต์เว็บไซต์แบบ static (HTML, CSS, JS, รูปภาพ) ที่ผู้ชมอยู่ทั่วโลก ต้องการค่าใช้จ่ายต่ำที่สุดและไม่ต้องดูแลเซิร์ฟเวอร์',
    question: 'สถาปัตยกรรมใดเหมาะที่สุด',
    choices: [
      'เก็บไฟล์บน Amazon S3 แล้วกระจายผ่าน Amazon CloudFront',
      'รัน EC2 สองเครื่องหลัง Application Load Balancer',
      'ใช้ AWS Elastic Beanstalk ที่มี Auto Scaling',
      'ใช้ Amazon Lightsail instance ในทุก Region',
    ],
    correctIndex: 0,
    explanation:
      'เว็บ static ไม่ต้องมี compute ฝั่งเซิร์ฟเวอร์ การเก็บบน S3 แล้วใช้ CloudFront แคชที่ edge จึงถูกที่สุด ไม่มีเซิร์ฟเวอร์ให้ดูแล และเร็วสำหรับผู้ใช้ทั่วโลก ตัวเลือกที่เหลือทั้งหมดต้องจ่ายค่าเครื่องตลอดเวลาและต้องบริหารจัดการมากกว่าโดยไม่ได้ประโยชน์เพิ่ม',
    relatedServices: ['s3', 'cloudfront', 'ec2', 'elastic-beanstalk', 'lightsail'],
  },
  {
    id: 'tech-sqs-decouple',
    domain: 'Technology',
    scenario:
      'ระบบรับคำสั่งซื้อส่งงานไปให้ระบบจัดการสต็อกโดยตรง เวลามีออร์เดอร์เข้ามาพร้อมกันจำนวนมาก ระบบสต็อกรับไม่ทันและออร์เดอร์บางส่วนหายไป ทีมต้องการแยกสองระบบออกจากกันและไม่ให้ข้อความหาย',
    question: 'ควรใช้บริการใด',
    choices: [
      'Amazon SQS',
      'Amazon SNS',
      'AWS Step Functions',
      'Amazon Kinesis Data Streams',
    ],
    correctIndex: 0,
    explanation:
      'คำใบ้คือ "decouple" และ "ข้อความต้องไม่หาย" SQS เป็นคิวที่เก็บข้อความไว้ให้ผู้รับมาดึงไปประมวลผลตามกำลังของตัวเอง ออร์เดอร์จึงรออยู่ในคิวแทนที่จะหลุดหาย SNS เป็น pub/sub แบบ push ที่ส่งถึงผู้รับหลายรายพร้อมกัน Step Functions ใช้ร้อยเรียงลำดับงาน Kinesis เหมาะกับสตรีมข้อมูลต่อเนื่องเพื่อวิเคราะห์แบบเรียลไทม์',
    relatedServices: ['sqs', 'sns', 'step-functions', 'kinesis'],
  },
  {
    id: 'tech-nat-gateway',
    domain: 'Technology',
    scenario:
      'EC2 instance อยู่ใน private subnet ต้องดาวน์โหลดแพตช์จากอินเทอร์เน็ตได้ แต่ต้องไม่ยอมให้ใครจากอินเทอร์เน็ตเปิดการเชื่อมต่อเข้ามาที่ instance เหล่านั้น',
    question: 'ควรใช้อะไร',
    choices: [
      'NAT Gateway ใน public subnet',
      'Internet Gateway ผูกกับ private subnet โดยตรง',
      'AWS Direct Connect',
      'VPC endpoint แบบ interface สำหรับทุกบริการ',
    ],
    correctIndex: 0,
    explanation:
      'NAT Gateway ทำให้ทราฟฟิก "ออกได้ เข้าไม่ได้" ซึ่งตรงกับโจทย์พอดี โดยต้องวางไว้ใน public subnet การผูก Internet Gateway ให้ subnet จะทำให้ subnet นั้นกลายเป็น public และเปิดรับการเชื่อมต่อขาเข้า Direct Connect เป็นสายเชื่อมไป on-premises ไม่ใช่ทางออกอินเทอร์เน็ต VPC endpoint ใช้เข้าถึงบริการ AWS แบบไม่ออกอินเทอร์เน็ต แต่ไม่ครอบคลุมการดาวน์โหลดแพตช์จากภายนอกทั่วไป',
    relatedServices: ['nat-gateway', 'vpc', 'direct-connect'],
  },
  {
    id: 'tech-snow-family',
    domain: 'Technology',
    scenario:
      'บริษัทต้องย้ายข้อมูลเก่า 500 TB จาก data center ขึ้น Amazon S3 อินเทอร์เน็ตที่หน้างานช้าและถ้าส่งผ่านสายจะใช้เวลาหลายเดือน',
    question: 'ควรใช้วิธีใด',
    choices: [
      'ใช้อุปกรณ์จาก AWS Snow Family ขนข้อมูลแบบออฟไลน์',
      'ตั้ง AWS Direct Connect แล้วอัปโหลดผ่านสายเช่า',
      'ใช้ AWS DataSync ผ่านอินเทอร์เน็ตเดิม',
      'ใช้ AWS Database Migration Service',
    ],
    correctIndex: 0,
    explanation:
      'เมื่อ bandwidth เป็นคอขวดและข้อมูลใหญ่ระดับหลายร้อย TB การส่งอุปกรณ์ทางกายภาพอย่าง Snowball Edge เร็วกว่าและคุ้มกว่า Direct Connect ช่วยเรื่อง bandwidth ระยะยาวแต่ใช้เวลาติดตั้งเป็นสัปดาห์ถึงเดือนและไม่ได้ออกแบบมาเพื่อการย้ายก้อนใหญ่ครั้งเดียว DataSync ยังต้องพึ่งอินเทอร์เน็ตเดิมที่ช้าอยู่ DMS ใช้ย้ายฐานข้อมูลไม่ใช่ไฟล์จำนวนมหาศาล',
    relatedServices: ['snow-family', 's3', 'direct-connect', 'dms'],
  },
  {
    id: 'tech-rds-multi-az',
    domain: 'Technology',
    scenario:
      'ฐานข้อมูล MySQL บน Amazon RDS เป็นระบบหลักของบริษัท ทีมต้องการให้ระบบสลับไปใช้เครื่องสำรองโดยอัตโนมัติหาก instance หลักหรือ AZ ที่มันอยู่ล่ม โดยเป้าหมายคือความพร้อมใช้งาน ไม่ใช่การเพิ่มความเร็วการอ่าน',
    question: 'ควรตั้งค่าอะไร',
    choices: [
      'เปิดใช้ Multi-AZ deployment',
      'เพิ่ม Read Replica ในอีก AZ',
      'เปลี่ยนไปใช้ DynamoDB global table',
      'เปิด automated backup ให้ถี่ขึ้น',
    ],
    correctIndex: 0,
    explanation:
      'Multi-AZ สร้าง standby แบบ synchronous ในอีก AZ และทำ automatic failover เพื่อความพร้อมใช้งาน ซึ่งตรงกับโจทย์ Read Replica เป็น asynchronous และมีไว้กระจายภาระการอ่าน ไม่ใช่กลไก HA หลัก การเปลี่ยนไป DynamoDB คือเปลี่ยนชนิดฐานข้อมูลทั้งหมดซึ่งเกินโจทย์ backup ช่วยกู้คืนข้อมูลแต่ไม่ทำให้ระบบสลับเครื่องเองอัตโนมัติ',
    relatedServices: ['rds', 'aurora', 'dynamodb'],
  },
  {
    id: 'tech-dynamodb',
    domain: 'Technology',
    scenario:
      'เกมมือถือต้องเก็บโปรไฟล์ผู้เล่นหลายสิบล้านคน อ่านและเขียนด้วย key ของผู้เล่นเป็นหลัก ต้องการ latency ระดับหลักหน่วยมิลลิวินาที รองรับทราฟฟิกพุ่งสูงมาก และไม่ต้องบริหารเซิร์ฟเวอร์ฐานข้อมูล',
    question: 'ควรเลือกฐานข้อมูลใด',
    choices: [
      'Amazon DynamoDB',
      'Amazon RDS for PostgreSQL',
      'Amazon Redshift',
      'Amazon Neptune',
    ],
    correctIndex: 0,
    explanation:
      'คำใบ้คือ key-value, สเกลมหาศาล, latency ระดับ single-digit millisecond และ serverless ซึ่งเป็นคุณสมบัติของ DynamoDB RDS เป็นฐานข้อมูลเชิงสัมพันธ์ที่ต้องเลือกขนาดเครื่องและสเกลได้จำกัดกว่า Redshift เป็น data warehouse สำหรับงานวิเคราะห์ Neptune เป็นฐานข้อมูลกราฟสำหรับข้อมูลเชิงความสัมพันธ์',
    relatedServices: ['dynamodb', 'rds', 'redshift', 'neptune'],
  },
  {
    id: 'tech-redshift-olap',
    domain: 'Technology',
    scenario:
      'ทีม BI ต้องรันคิวรี SQL ที่สรุปยอดขายย้อนหลัง 5 ปีจากข้อมูลหลายสิบเทระไบต์ เพื่อทำรายงานผู้บริหาร ไม่ได้ใช้รองรับธุรกรรมรายวันของหน้าร้าน',
    question: 'ควรใช้บริการใด',
    choices: [
      'Amazon Redshift',
      'Amazon Aurora',
      'Amazon ElastiCache',
      'Amazon DocumentDB',
    ],
    correctIndex: 0,
    explanation:
      'งานนี้เป็น OLAP หรือการวิเคราะห์ข้อมูลปริมาณมาก ซึ่ง Redshift ออกแบบมาโดยเฉพาะด้วยการเก็บแบบ columnar และประมวลผลขนาน Aurora เหมาะกับ OLTP คือธุรกรรมรายวัน ElastiCache เป็นแคชในหน่วยความจำ DocumentDB เป็นฐานข้อมูลเอกสารที่เข้ากันได้กับ MongoDB',
    relatedServices: ['redshift', 'aurora', 'elasticache', 'documentdb'],
  },
  {
    id: 'tech-efs-shared',
    domain: 'Technology',
    scenario:
      'EC2 instance ที่รัน Linux จำนวน 12 เครื่องกระจายอยู่หลาย Availability Zone ทุกเครื่องต้องอ่านและเขียนไฟล์ชุดเดียวกันพร้อมกัน',
    question: 'ควรใช้ที่เก็บข้อมูลแบบใด',
    choices: [
      'Amazon EFS',
      'Amazon EBS volume ลูกเดียวแนบทุกเครื่อง',
      'Amazon S3 Glacier',
      'instance store ของแต่ละเครื่อง',
    ],
    correctIndex: 0,
    explanation:
      'EFS เป็น managed file system โปรโตคอล NFS ที่ mount พร้อมกันได้จากหลาย instance ข้าม AZ จึงตรงโจทย์ EBS volume ปกติผูกกับ AZ เดียวและออกแบบมาให้แนบกับ instance เดียวเป็นหลัก S3 Glacier เป็น archive ที่ดึงข้อมูลช้า ไม่ใช่ file system instance store เป็นดิสก์ชั่วคราวติดกับตัวเครื่องและหายเมื่อเครื่องหยุด',
    relatedServices: ['efs', 'ebs', 's3-glacier', 'fsx'],
  },
  {
    id: 'tech-cloudformation-iac',
    domain: 'Technology',
    scenario:
      'ทีมต้องสร้างสภาพแวดล้อม dev, staging และ production ให้เหมือนกันทุกครั้ง และต้องสร้างซ้ำใน Region อื่นได้ โดยไม่อยากคลิกสร้างทรัพยากรทีละชิ้นใน Console',
    question: 'ควรใช้บริการใด',
    choices: [
      'AWS CloudFormation',
      'AWS Systems Manager Run Command',
      'AWS Config',
      'AWS Trusted Advisor',
    ],
    correctIndex: 0,
    explanation:
      'คำใบ้คือ repeatable และ template ซึ่งเป็นงานของ CloudFormation ที่ประกาศทรัพยากรเป็น JSON หรือ YAML แล้วสร้างเป็น stack ซ้ำได้ ตัวบริการฟรี จ่ายเฉพาะทรัพยากรที่ถูกสร้าง Run Command ใช้สั่งคำสั่งบนเครื่องที่มีอยู่แล้ว AWS Config ติดตามการตั้งค่า Trusted Advisor ให้คำแนะนำ',
    relatedServices: ['cloudformation', 'cdk', 'systems-manager', 'config'],
  },

  // ----------------------------------------------------- Billing & Support (11)
  {
    id: 'bill-savings-plans',
    domain: 'Billing & Support',
    scenario:
      'บริษัทมี workload ที่รันต่อเนื่อง 24 ชั่วโมงทุกวันและคาดว่าจะรันอย่างน้อย 3 ปี ปริมาณการใช้ค่อนข้างคงที่ แต่ทีมอาจเปลี่ยน instance family และย้ายบางส่วนไปรันบน Fargate หรือ Lambda ในอนาคต ต้องการส่วนลดสูงสุดพร้อมความยืดหยุ่น',
    question: 'ควรเลือกโมเดลราคาใด',
    choices: [
      'Compute Savings Plans แบบ 3 ปี',
      'Standard Reserved Instances แบบ 3 ปีผูก instance type',
      'Spot Instances',
      'On-Demand Instances',
    ],
    correctIndex: 0,
    explanation:
      'Compute Savings Plans คอมมิตเป็นยอดใช้จ่ายต่อชั่วโมง ลดได้ถึงราว 66-72% และครอบคลุม EC2 ข้าม instance family และ Region รวมถึง Fargate และ Lambda จึงยืดหยุ่นตรงตามโจทย์ Standard RI ให้ส่วนลดสูงแต่ผูกกับสเปกที่จองไว้ Spot ถูกที่สุดแต่ถูกเรียกคืนได้จึงไม่เหมาะกับงานที่ต้องรันต่อเนื่อง On-Demand ไม่มีส่วนลด',
    relatedServices: ['savings-plans', 'reserved-instances', 'spot-instances', 'lambda', 'fargate'],
  },
  {
    id: 'bill-spot',
    domain: 'Billing & Support',
    scenario:
      'งานประมวลผลภาพแบบ batch รันตอนกลางคืน ถ้างานถูกขัดจังหวะกลางทางสามารถเริ่มชิ้นนั้นใหม่ได้โดยไม่กระทบใคร ทีมต้องการต้นทุนต่ำที่สุดเท่าที่จะเป็นไปได้',
    question: 'ควรใช้ตัวเลือกการซื้อแบบใด',
    choices: [
      'Spot Instances',
      'On-Demand Instances',
      'Reserved Instances แบบ All Upfront',
      'Dedicated Hosts',
    ],
    correctIndex: 0,
    explanation:
      'Spot ให้ส่วนลดสูงสุดถึงราว 90% แลกกับการที่ AWS เรียกคืนเครื่องได้โดยแจ้งล่วงหน้า 2 นาที ซึ่งยอมรับได้เพราะโจทย์บอกว่างานขัดจังหวะแล้วเริ่มใหม่ได้ On-Demand ไม่มีส่วนลด RI เหมาะกับงานที่รันคงที่ระยะยาวไม่ใช่งานกลางคืนเป็นช่วง Dedicated Hosts มีไว้สำหรับข้อกำหนด license หรือการแยกฮาร์ดแวร์และแพงกว่า',
    relatedServices: ['spot-instances', 'reserved-instances', 'aws-batch', 'ec2'],
  },
  {
    id: 'bill-budgets-alert',
    domain: 'Billing & Support',
    scenario:
      'ฝ่ายการเงินเคยเจอบิลเดือนหนึ่งพุ่งเกินงบโดยไม่มีใครรู้ตัวจนสิ้นเดือน ทีมต้องการให้มีอีเมลแจ้งเตือนทันทีเมื่อค่าใช้จ่ายจริงหรือค่าพยากรณ์เกินเพดานที่ตั้งไว้',
    question: 'ควรใช้บริการใด',
    choices: [
      'AWS Budgets',
      'AWS Cost Explorer',
      'AWS Pricing Calculator',
      'AWS Cost and Usage Report',
    ],
    correctIndex: 0,
    explanation:
      'คำใบ้ที่ชัดที่สุดคือคำว่า "แจ้งเตือนเมื่อเกินเพดาน" ซึ่งเป็นหน้าที่ของ AWS Budgets ที่ตั้งงบแล้วส่งการแจ้งเตือนผ่านอีเมลหรือ SNS ได้ Cost Explorer ใช้ดูและวิเคราะห์ค่าใช้จ่ายย้อนหลัง Pricing Calculator ใช้ประมาณค่าใช้จ่ายล่วงหน้าก่อนสร้างทรัพยากร Cost and Usage Report เป็นไฟล์รายละเอียดการใช้งานสำหรับวิเคราะห์เชิงลึก',
    relatedServices: ['budgets', 'cost-explorer', 'pricing-calculator', 'sns'],
  },
  {
    id: 'bill-cost-explorer',
    domain: 'Billing & Support',
    scenario:
      'ผู้บริหารถามว่า 6 เดือนที่ผ่านมาบริษัทจ่ายเงินให้บริการใดมากที่สุด และแนวโน้มค่าใช้จ่ายเดือนหน้าน่าจะเป็นเท่าไร',
    question: 'ควรใช้เครื่องมือใด',
    choices: [
      'AWS Cost Explorer',
      'AWS Budgets',
      'AWS Pricing Calculator',
      'AWS Artifact',
    ],
    correctIndex: 0,
    explanation:
      'Cost Explorer แสดงกราฟค่าใช้จ่ายย้อนหลังได้ถึง 12 เดือน แยกตามบริการ tag บัญชี และภูมิภาค พร้อมพยากรณ์ค่าใช้จ่ายล่วงหน้า จึงตอบทั้งสองคำถาม Budgets เน้นแจ้งเตือนเมื่อเกินงบ Pricing Calculator ประเมินก่อนใช้จริง Artifact เป็นที่ดาวน์โหลดรายงาน compliance',
    relatedServices: ['cost-explorer', 'budgets', 'pricing-calculator'],
  },
  {
    id: 'bill-support-enterprise',
    domain: 'Billing & Support',
    scenario:
      'องค์กรรันระบบที่ธุรกิจหยุดไม่ได้บน AWS ต้องการที่ปรึกษาทางเทคนิคประจำที่รู้จักระบบของตัวเอง และต้องการเวลาตอบกลับเคสระดับ business-critical ภายใน 15 นาที',
    question: 'ควรใช้แผน AWS Support ใด',
    choices: [
      'Enterprise',
      'Business',
      'Developer',
      'Basic',
    ],
    correctIndex: 0,
    explanation:
      'แผน Enterprise ให้ Technical Account Manager (TAM) เป็นที่ปรึกษาประจำ และมีเวลาตอบกลับเคส business-critical ภายใน 15 นาที Business ตอบเคส production ที่ล่มภายใน 1 ชั่วโมงและไม่มี TAM Developer ตอบทางอีเมลในเวลาทำการ Basic ฟรีและไม่มีการสนับสนุนทางเทคนิคแบบเปิดเคส',
    relatedServices: ['support-plans', 'trusted-advisor'],
  },
  {
    id: 'bill-organizations',
    domain: 'Billing & Support',
    scenario:
      'บริษัทมีบัญชี AWS แยกกัน 12 บัญชีตามทีม ฝ่ายการเงินเหนื่อยกับการจ่ายบิล 12 ใบ และผู้บริหารอยากได้ส่วนลดตามปริมาณการใช้รวมของทั้งองค์กร',
    question: 'ควรทำอย่างไร',
    choices: [
      'รวมบัญชีเข้า AWS Organizations เพื่อใช้ consolidated billing',
      'ยุบทุกทีมให้มาใช้บัญชี AWS เดียวกัน',
      'ขอใบแจ้งหนี้รวมจาก AWS Support ทุกเดือน',
      'ซื้อ Reserved Instances แยกในแต่ละบัญชี',
    ],
    correctIndex: 0,
    explanation:
      'AWS Organizations พร้อม consolidated billing รวมค่าใช้จ่ายทุกบัญชีมาชำระที่ management account ใบเดียว และรวมปริมาณการใช้เพื่อให้ได้ volume discount รวมถึงแชร์สิทธิ์ Reserved Instances และ Savings Plans ข้ามบัญชี การยุบเหลือบัญชีเดียวทำให้เสียการแยกขอบเขตความปลอดภัยระหว่างทีม การซื้อ RI แยกบัญชีไม่ได้ช่วยเรื่องบิลรวมหรือส่วนลดตามปริมาณรวม',
    relatedServices: ['organizations', 'consolidated-billing', 'control-tower', 'savings-plans'],
  },
  {
    id: 'bill-support-business-24x7',
    domain: 'Billing & Support',
    scenario:
      'สตาร์ทอัพเพิ่งย้ายระบบขึ้น production บน AWS ทีมต้องการโทรหา AWS ได้ตลอด 24 ชั่วโมงเมื่อระบบจริงล่ม และอยากได้คำแนะนำจาก Trusted Advisor ครบทุก check เพื่อไล่ปรับต้นทุนและความปลอดภัย งบยังจำกัดจึงไม่ต้องการที่ปรึกษาประจำ',
    question: 'ควรเลือกแผน AWS Support ใด',
    choices: ['Business', 'Developer', 'Basic', 'Enterprise'],
    correctIndex: 0,
    explanation:
      'Business เป็นแผนต่ำสุดที่ให้ติดต่อทางโทรศัพท์ แชต และอีเมลได้ 24/7 พร้อมเวลาตอบกลับ 1 ชั่วโมงเมื่อ production ล่ม และเป็นแผนแรกที่ปลดล็อก Trusted Advisor ครบทุก check Developer ตอบทางอีเมลในเวลาทำการเท่านั้นและได้แค่ core checks Basic เปิดเคสทางเทคนิคไม่ได้เลย Enterprise ตอบโจทย์ได้แต่เกินความจำเป็นและแพงกว่ามากเพราะโจทย์บอกว่าไม่ต้องการที่ปรึกษาประจำ',
    relatedServices: ['support-plans', 'trusted-advisor'],
  },
  {
    id: 'bill-support-onramp',
    domain: 'Billing & Support',
    scenario:
      'บริษัทขนาดกลางเริ่มมี workload สำคัญบน AWS ต้องการเวลาตอบกลับเคสระดับ business-critical ภายใน 30 นาที และอยากเข้าถึง Technical Account Manager เพื่อขอ consultative review แต่ยังจ่ายค่าแผนระดับสูงสุดไม่ไหว',
    question: 'แผน AWS Support ใดตรงที่สุด',
    choices: ['Enterprise On-Ramp', 'Business', 'Enterprise', 'Developer'],
    correctIndex: 0,
    explanation:
      'Enterprise On-Ramp ให้เวลาตอบกลับเคส business-critical ภายใน 30 นาที และให้เข้าถึง TAM แบบทีมกลาง (pool of TAMs) พร้อม consultative review ในราคาต่ำกว่า Enterprise Business ไม่มี TAM และไม่ครอบคลุมความรุนแรงระดับ business-critical Enterprise ตอบใน 15 นาทีและให้ TAM ประจำแต่ราคาสูงกว่าที่โจทย์รับได้ Developer ตอบเฉพาะเวลาทำการ',
    relatedServices: ['support-plans', 'trusted-advisor'],
  },
  {
    id: 'bill-support-basic-limit',
    domain: 'Billing & Support',
    scenario:
      'นักพัฒนาเปิดบัญชี AWS ใหม่ใช้แผน Basic Support แล้วเจอปัญหาการตั้งค่า Lambda จึงอยากเปิดเคสถามวิศวกรของ AWS โดยไม่เสียค่าใช้จ่ายเพิ่ม',
    question: 'ข้อใดอธิบายสิ่งที่เกิดขึ้นได้ถูกต้อง',
    choices: [
      'แผน Basic เปิดเคสได้เฉพาะเรื่องบัญชี การเรียกเก็บเงิน และการขอเพิ่ม service quota ต้องอัปเกรดแผนถ้าต้องการสนับสนุนทางเทคนิค',
      'แผน Basic เปิดเคสทางเทคนิคได้ไม่จำกัด แต่ตอบช้ากว่าแผนอื่น',
      'แผน Basic เปิดเคสทางเทคนิคได้ 3 เคสต่อเดือน',
      'แผน Basic เปิดเคสทางเทคนิคได้เฉพาะผ่านโทรศัพท์',
    ],
    correctIndex: 0,
    explanation:
      'Basic ใช้ฟรีกับทุกบัญชีแต่ไม่ให้การสนับสนุนทางเทคนิคแบบเปิดเคส สิ่งที่เปิดเคสได้คือเรื่องบัญชี การเรียกเก็บเงิน และการขอเพิ่ม service quota คำถามทางเทคนิคต้องพึ่งเอกสาร whitepaper และ AWS re:Post ถ้าต้องการคุยกับวิศวกรต้องขึ้นไป Developer เป็นอย่างน้อย และไม่มีโควตาเคสทางเทคนิคแบบจำกัดจำนวนในแผน Basic',
    relatedServices: ['support-plans', 'health-dashboard'],
  },
  {
    id: 'bill-support-trusted-advisor-gate',
    domain: 'Billing & Support',
    scenario:
      'ทีมความปลอดภัยอยากใช้ Trusted Advisor ให้ครบทุก check ทั้งด้าน cost optimization, performance, security, fault tolerance และ service limits ปัจจุบันบัญชีใช้แผน Developer Support แล้วเห็นเพียงบาง check',
    question: 'ต้องทำอย่างไรจึงจะเห็น check ทั้งหมด',
    choices: [
      'อัปเกรดเป็นแผน Business, Enterprise On-Ramp หรือ Enterprise',
      'เปิดใช้ AWS Config เพิ่มเติมในทุก Region',
      'ขอสิทธิ์เพิ่มผ่าน IAM policy ให้ผู้ใช้ในบัญชี',
      'ย้ายบัญชีเข้า AWS Organizations',
    ],
    correctIndex: 0,
    explanation:
      'Trusted Advisor ครบทุก check เป็นสิทธิ์ที่ผูกกับแผน support ตั้งแต่ Business ขึ้นไป แผน Basic และ Developer เห็นเพียง core checks จึงต้องอัปเกรดแผน ไม่ใช่เรื่องของ IAM permission ที่กำหนดแค่ว่าใครเข้าดูได้ AWS Config ติดตามการเปลี่ยนแปลงการตั้งค่าซึ่งเป็นบริการแยกกัน และการเข้า AWS Organizations ช่วยเรื่องบิลรวมกับนโยบาย ไม่ได้ปลดล็อก check',
    relatedServices: ['support-plans', 'trusted-advisor', 'config'],
  },
  {
    id: 'bill-support-tam-iem',
    domain: 'Billing & Support',
    scenario:
      'ร้านค้าออนไลน์กำลังเตรียมแคมเปญลดราคาใหญ่ที่คาดว่าจะมีทราฟฟิกพุ่งหลายเท่า ต้องการให้ AWS ช่วยวางแผนรับโหลดและเฝ้าระบบร่วมกันในช่วงเวลานั้น พร้อมมีที่ปรึกษาทางเทคนิคประจำที่รู้จักสถาปัตยกรรมของร้าน',
    question: 'สิ่งที่โจทย์ต้องการมาจากอะไร',
    choices: [
      'Infrastructure Event Management และ Technical Account Manager ประจำ ซึ่งรวมอยู่ในแผน Enterprise',
      'AWS Trusted Advisor ซึ่งใช้ได้ฟรีกับทุกแผน',
      'AWS Professional Services ซึ่งรวมอยู่ในแผน Business',
      'AWS Artifact ซึ่งให้รายงานความพร้อมรับโหลด',
    ],
    correctIndex: 0,
    explanation:
      'การให้ AWS ช่วยวางแผนและเฝ้าระบบร่วมกันในช่วงอีเวนต์สำคัญคือบริการ Infrastructure Event Management ซึ่งรวมอยู่ในแผน Enterprise (Enterprise On-Ramp ได้ 1 ครั้งต่อปี และ Business ต้องซื้อเพิ่ม) ส่วนที่ปรึกษาประจำคือ designated TAM ที่มีเฉพาะ Enterprise Trusted Advisor ให้คำแนะนำอัตโนมัติแต่ไม่ได้มาเฝ้าอีเวนต์ และไม่ได้ครบทุก check ในทุกแผน Professional Services เป็นบริการที่คิดค่าใช้จ่ายแยก Artifact เป็นที่ดาวน์โหลดรายงาน compliance',
    relatedServices: ['support-plans', 'trusted-advisor', 'artifact'],
  },
]

/** Number of questions in the bank. */
export const TOTAL_QUESTIONS = quizQuestions.length

/** How many questions one session serves by default. */
export const DEFAULT_QUIZ_LENGTH = 10

/** Count of questions per domain, plus the "all" total. */
export const domainCounts: Record<QuizDomainFilter, number> = (() => {
  const counts = { all: quizQuestions.length } as Record<QuizDomainFilter, number>
  for (const domain of QUIZ_DOMAINS) {
    counts[domain] = 0
  }
  for (const question of quizQuestions) {
    counts[question.domain] += 1
  }
  return counts
})()

/** Thai labels for the quiz domains. */
export const QUIZ_DOMAIN_LABELS_TH: Record<QuizDomain, string> = {
  'Cloud Concepts': 'แนวคิดคลาวด์',
  'Security & Compliance': 'ความปลอดภัยและการกำกับ',
  Technology: 'เทคโนโลยีและบริการ',
  'Billing & Support': 'ค่าใช้จ่ายและซัพพอร์ต',
}

/** Tailwind accents per domain. */
export const QUIZ_DOMAIN_STYLES: Record<QuizDomain, { badge: string; dot: string }> = {
  'Cloud Concepts': { badge: 'bg-sky-500 text-white', dot: 'bg-sky-500' },
  'Security & Compliance': { badge: 'bg-red-500 text-white', dot: 'bg-red-500' },
  Technology: { badge: 'bg-indigo-500 text-white', dot: 'bg-indigo-500' },
  'Billing & Support': { badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-500' },
}
