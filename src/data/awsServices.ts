import type { AWSService, Category, CategoryFilterValue } from '../types'
import { CATEGORIES } from '../types'

/**
 * Static AWS service dataset for the CLF-C02 exam (128 entries across 15 categories).
 * Counts per category: Compute 11, Storage 9, Database 8, Analytics 5, Networking 14,
 * Security 20, Serverless 5, Management 15, Developer Tools 6, Business Apps 2,
 * End-User Computing 3, IoT 1, AI/ML 12, Migration 6, Billing 11.
 * Every id has a matching icon in src/assets/aws-icons (see serviceIcons.ts).
 */
export const awsServices: AWSService[] = [
  // ---------------------------------------------------------------- Compute (11)
  {
    id: 'ec2',
    name: 'EC2',
    fullName: 'Elastic Compute Cloud',
    category: 'Compute',
    description: 'เครื่องเซิร์ฟเวอร์เสมือน (virtual machine) ที่เปิด-ปิดได้ตามต้องการ',
    answer:
      'บริการ virtual server ในคลาวด์ เลือก instance type, OS และขนาดเครื่องได้เอง จ่ายตามเวลาที่ใช้ (pay-as-you-go) และปรับขยายด้วย Auto Scaling',
    hint: 'ถ้าโจทย์บอกว่า "ต้องควบคุม OS เอง" หรือ "ยก server เดิมขึ้นคลาวด์แบบ lift-and-shift" ให้นึกถึง EC2',
    examTips:
      'จำ pricing model ให้ได้: On-Demand (ยืดหยุ่นสุด), Reserved (คอมมิต 1-3 ปี ถูกลงถึง 72%), Spot (ถูกสุดถึง 90% แต่ถูกดึงคืนได้), Dedicated Host (ต้องการ license แบบผูกกับ hardware)',
  },
  {
    id: 'lambda',
    name: 'Lambda',
    fullName: 'AWS Lambda',
    category: 'Compute',
    description: 'รันโค้ดตาม event โดยไม่ต้องดูแลเซิร์ฟเวอร์ จ่ายตามจำนวนครั้งและเวลาที่รัน',
    answer:
      'บริการ serverless compute ที่รันฟังก์ชันเมื่อมี trigger (S3, API Gateway, EventBridge) ไม่มีเซิร์ฟเวอร์ให้จัดการ สเกลอัตโนมัติ และไม่มีค่าใช้จ่ายเมื่อไม่ถูกเรียก',
    hint: 'คิดถึงงานสั้น ๆ ที่ตอบสนอง event เช่น resize รูปทันทีที่อัปโหลดขึ้น S3',
    examTips:
      'timeout สูงสุด 15 นาที — โจทย์ที่งานรันนานกว่านั้นต้องตอบ EC2, ECS หรือ Fargate ไม่ใช่ Lambda',
  },
  {
    id: 'ecs',
    name: 'ECS',
    fullName: 'Elastic Container Service',
    category: 'Compute',
    description: 'บริการจัดการคอนเทนเนอร์ของ AWS เอง ไม่ใช้ Kubernetes',
    answer:
      'container orchestration ที่ AWS พัฒนาขึ้นเอง สำหรับรัน Docker container เป็น task และ service เลือก launch type ได้ทั้ง EC2 (คุมเครื่องเอง) และ Fargate (ไม่ต้องคุมเครื่อง)',
    hint: 'อยากรัน Docker แต่ไม่อยากเรียน Kubernetes ให้เลือก ECS',
    examTips: 'ข้อสอบมักให้เทียบ ECS (proprietary ของ AWS) กับ EKS (มาตรฐาน Kubernetes)',
  },
  {
    id: 'eks',
    name: 'EKS',
    fullName: 'Elastic Kubernetes Service',
    category: 'Compute',
    description: 'บริการ Kubernetes แบบ managed ตามมาตรฐาน open-source',
    answer:
      'managed Kubernetes control plane ที่ AWS ดูแล upgrade และ HA ให้ ใช้ manifest และเครื่องมือ Kubernetes มาตรฐานได้ตรง ๆ',
    hint: 'โจทย์ที่บอกว่า "ทีมใช้ Kubernetes อยู่แล้ว" หรือ "ต้องย้ายจาก on-premises Kubernetes" ให้ตอบ EKS',
    examTips: 'เลือก EKS เมื่อโจทย์เน้น portability ข้ามคลาวด์ เพราะเป็น Kubernetes มาตรฐาน',
  },
  {
    id: 'fargate',
    name: 'Fargate',
    fullName: 'AWS Fargate',
    category: 'Compute',
    description: 'รันคอนเทนเนอร์แบบ serverless ไม่ต้องจัดการเครื่อง EC2 เลย',
    answer:
      'serverless compute engine สำหรับคอนเทนเนอร์ ใช้ร่วมกับ ECS หรือ EKS โดย AWS จัดหาและ patch เครื่องให้ทั้งหมด จ่ายตาม vCPU และหน่วยความจำที่ task ใช้',
    hint: 'Fargate ไม่ใช่ orchestrator แต่เป็น "เครื่องยนต์" ที่อยู่ใต้ ECS/EKS',
    examTips:
      'คำใบ้ในโจทย์คือ "ไม่ต้องบริหาร server" + "คอนเทนเนอร์" — คำตอบคือ Fargate ไม่ใช่ EC2 launch type',
  },
  {
    id: 'elastic-beanstalk',
    name: 'Elastic Beanstalk',
    fullName: 'AWS Elastic Beanstalk',
    category: 'Compute',
    description: 'PaaS ที่อัปโหลดโค้ดแล้วระบบสร้าง infrastructure ให้เองทั้งชุด',
    answer:
      'Platform as a Service ที่รับโค้ด (Java, .NET, Node.js, Python, PHP, Ruby, Go, Docker) แล้วเตรียม EC2, Load Balancer, Auto Scaling และ monitoring ให้อัตโนมัติ',
    hint: 'นักพัฒนาอยากโฟกัสแค่โค้ด ไม่อยากตั้ง infrastructure เอง — Beanstalk ตอบโจทย์',
    examTips:
      'ตัวบริการฟรี จ่ายแค่ทรัพยากรที่มันสร้าง และผู้ใช้ยัง SSH เข้า EC2 ที่อยู่ข้างใต้ได้ (ต่างจาก Lambda)',
  },
  {
    id: 'lightsail',
    name: 'Lightsail',
    fullName: 'Amazon Lightsail',
    category: 'Compute',
    description: 'เซิร์ฟเวอร์สำเร็จรูปราคาคงที่รายเดือน เหมาะกับงานเล็กและผู้เริ่มต้น',
    answer:
      'บริการ VPS แบบง่ายที่รวม compute, storage และ networking เป็นแพ็กเกจราคาคงที่ (predictable monthly price) มี blueprint สำเร็จ เช่น WordPress, LAMP',
    hint: 'คำใบ้คือ "ง่ายที่สุด" + "ราคาคาดการณ์ได้" + "ผู้ใช้ไม่มีประสบการณ์คลาวด์"',
    examTips: 'อย่าสับสนกับ EC2 — Lightsail เน้นความง่ายและราคาคงที่ ไม่ใช่ความยืดหยุ่นสูงสุด',
  },
  {
    id: 'aws-batch',
    name: 'AWS Batch',
    fullName: 'AWS Batch',
    category: 'Compute',
    description: 'จัดคิวและรันงานประมวลผลแบบ batch จำนวนมากโดยจัดสรรเครื่องให้เอง',
    answer:
      'บริการรัน batch computing job หลายพันงาน โดยจัดคิว (job queue) และเลือกขนาด compute environment ให้เหมาะสมอัตโนมัติ ใช้ Spot Instances เพื่อลดต้นทุนได้',
    hint: 'งานวิจัย เรนเดอร์ภาพยนตร์ หรือประมวลผลข้อมูลกลางคืนที่ไม่ต้องตอบสนองทันที',
    examTips: 'ต่างจาก Lambda ที่จำกัด 15 นาที — Batch รองรับงานที่รันนานหลายชั่วโมง',
  },
  {
    id: 'outposts',
    name: 'Outposts',
    fullName: 'AWS Outposts',
    category: 'Compute',
    description: 'ยกแร็ค hardware ของ AWS ไปติดตั้งใน data center ของลูกค้า',
    answer:
      'บริการ hybrid ที่ AWS ส่ง rack พร้อมบริการอย่าง EC2 และ EBS ไปวางในสถานที่ของลูกค้า ใช้ API เดียวกับบนคลาวด์ เพื่อรองรับงานที่ต้องการ low latency หรือ data residency',
    hint: 'ข้อมูลต้องอยู่ในตึกเราตามกฎหมาย แต่ยังอยากใช้ API ของ AWS',
    examTips: 'คำใบ้: "on-premises" + "ต้องใช้บริการ AWS แบบเดิม" + "ต้องการ latency ต่ำมาก"',
  },
  {
    id: 'wavelength',
    name: 'Wavelength',
    fullName: 'AWS Wavelength',
    category: 'Compute',
    description: 'วางบริการ AWS ไว้ในเครือข่าย 5G ของผู้ให้บริการมือถือ',
    answer:
      'Wavelength Zone ที่ฝัง compute และ storage ของ AWS ไว้ใน edge ของเครือข่าย 5G ทำให้แอปบนมือถือมี latency ระดับหลักมิลลิวินาที',
    hint: 'เกม AR/VR บนมือถือ หรือรถยนต์เชื่อมต่อที่ต้องตอบสนองเร็วมาก',
    examTips: 'จำคู่กัน: Outposts = ใน data center ลูกค้า, Wavelength = ในเครือข่าย 5G, Local Zones = ใกล้เมืองใหญ่',
  },
  {
    id: 'ecr',
    name: 'ECR',
    fullName: 'Amazon Elastic Container Registry',
    category: 'Compute',
    description: 'ที่เก็บ Docker/container image แบบ private ที่ AWS ดูแลให้',
    answer:
      'managed container registry สำหรับเก็บ จัดการ และแชร์ container image เข้ารหัสอัตโนมัติ สแกนช่องโหว่ได้ (ร่วมกับ Inspector) และดึง image ไปรันบน ECS, EKS หรือ Fargate ได้ทันที',
    hint: 'ECR คือ "โกดังเก็บ image" ส่วน ECS/EKS คือ "คนเอา image ไปรัน"',
    examTips: 'โจทย์ที่ถามว่า "เก็บ container image ไว้ที่ไหน" ให้ตอบ ECR ไม่ใช่ S3 หรือ ECS',
  },

  // ---------------------------------------------------------------- Storage (9)
  {
    id: 's3',
    name: 'S3',
    fullName: 'Simple Storage Service',
    category: 'Storage',
    description: 'ที่เก็บไฟล์แบบ object storage ขยายได้ไม่จำกัด เข้าถึงผ่าน HTTP',
    answer:
      'object storage ที่เก็บข้อมูลเป็น object ใน bucket ทนทาน 99.999999999% (11 nines) รองรับ versioning, lifecycle policy, encryption และ static website hosting',
    hint: 'ไฟล์รูป วิดีโอ backup หรือ data lake ให้นึกถึง S3 ก่อนเสมอ',
    examTips:
      'จำ storage class: Standard, Intelligent-Tiering (ไม่รู้ pattern การใช้), Standard-IA, One Zone-IA, Glacier, Glacier Deep Archive (ถูกสุด ดึงช้าสุด)',
  },
  {
    id: 'ebs',
    name: 'EBS',
    fullName: 'Elastic Block Store',
    category: 'Storage',
    description: 'ฮาร์ดดิสก์เสมือนแบบ block ที่ผูกกับ EC2 หนึ่งเครื่องใน AZ เดียว',
    answer:
      'block storage volume ที่แนบกับ EC2 instance ใช้เป็นดิสก์ระบบหรือดิสก์ฐานข้อมูล ข้อมูลคงอยู่แม้ปิดเครื่อง และ snapshot ไปเก็บใน S3 ได้',
    hint: 'เหมือนฮาร์ดดิสก์เสียบเข้าเครื่องหนึ่งเครื่อง ไม่ใช่ที่เก็บไฟล์ที่แชร์กันหลายเครื่อง',
    examTips: 'EBS ผูกกับ Availability Zone เดียว — ถ้าโจทย์ต้องการ shared file system หลายเครื่องให้ตอบ EFS',
  },
  {
    id: 'efs',
    name: 'EFS',
    fullName: 'Elastic File System',
    category: 'Storage',
    description: 'ระบบไฟล์แชร์แบบ NFS ที่หลาย instance ต่อพร้อมกันได้ ข้าม AZ',
    answer:
      'managed file storage โปรโตคอล NFS สำหรับ Linux ที่ mount พร้อมกันได้จากหลาย EC2 ข้าม Availability Zone และขยายความจุอัตโนมัติ',
    hint: 'คำใบ้คือ "shared file system" หรือ "หลายเครื่องต้องอ่านเขียนไฟล์ชุดเดียวกัน"',
    examTips: 'EFS = Linux/NFS, FSx for Windows File Server = Windows/SMB',
  },
  {
    id: 's3-glacier',
    name: 'S3 Glacier',
    fullName: 'Amazon S3 Glacier',
    category: 'Storage',
    description: 'ที่เก็บข้อมูลถาวรราคาถูกมากสำหรับข้อมูลที่แทบไม่ถูกเรียกดู',
    answer:
      'storage class สำหรับ archive ระยะยาว ราคาต่อ GB ถูกที่สุดในตระกูล S3 แลกกับเวลาในการดึงข้อมูล (retrieval) ตั้งแต่หลักมิลลิวินาทีถึงหลายชั่วโมง',
    hint: 'เอกสารที่กฎหมายบังคับให้เก็บ 7 ปี แต่แทบไม่มีใครเปิดดู',
    examTips:
      'Glacier Instant Retrieval (มิลลิวินาที), Flexible Retrieval (นาที-ชั่วโมง), Deep Archive (12-48 ชั่วโมง ถูกสุด)',
  },
  {
    id: 'storage-gateway',
    name: 'Storage Gateway',
    fullName: 'AWS Storage Gateway',
    category: 'Storage',
    description: 'สะพานเชื่อมที่เก็บข้อมูล on-premises เข้ากับ storage บน AWS',
    answer:
      'บริการ hybrid storage ที่ติดตั้ง appliance ในองค์กร ให้ระบบเดิมเห็น AWS เป็น file share (File Gateway), tape library (Tape Gateway) หรือ iSCSI volume (Volume Gateway)',
    hint: 'อยากเลิกใช้เทปสำรองข้อมูล แต่ซอฟต์แวร์ backup เดิมเปลี่ยนไม่ได้',
    examTips: 'คำใบ้คือ "hybrid" + "ระบบเดิมใน data center ต้องใช้ storage บนคลาวด์แบบไม่แก้แอป"',
  },
  {
    id: 'snow-family',
    name: 'Snow Family',
    fullName: 'AWS Snow Family',
    category: 'Storage',
    description: 'อุปกรณ์ฮาร์ดแวร์ที่ส่งไปให้ลูกค้าก๊อปข้อมูลแล้วส่งกลับเข้า AWS',
    answer:
      'ชุดอุปกรณ์ขนย้ายข้อมูลออฟไลน์: Snowcone (ขนาดเล็ก ~8-14 TB), Snowball Edge (หลักสิบ TB ถึง ~80 TB พร้อม compute), Snowmobile (คอนเทนเนอร์ระดับ 100 PB)',
    hint: 'ข้อมูลใหญ่มากจนส่งผ่านอินเทอร์เน็ตแล้วใช้เวลาเป็นเดือน ให้ส่งของทางกายภาพเร็วกว่า',
    examTips: 'โจทย์ที่บอกว่า bandwidth จำกัดหรือไม่มีอินเทอร์เน็ตที่หน้างาน ให้ตอบ Snow Family ไม่ใช่ Direct Connect',
  },
  {
    id: 'fsx',
    name: 'FSx',
    fullName: 'Amazon FSx',
    category: 'Storage',
    description: 'ระบบไฟล์แบบ managed สำหรับ Windows, Lustre, NetApp และ OpenZFS',
    answer:
      'บริการ file system ที่รองรับหลายชนิด: FSx for Windows File Server (SMB, Active Directory), FSx for Lustre (HPC ประสิทธิภาพสูง), FSx for NetApp ONTAP และ FSx for OpenZFS',
    hint: 'ต้องการ SMB share สำหรับแอป Windows หรือ file system ความเร็วสูงสำหรับงาน HPC',
    examTips: 'FSx for Lustre = machine learning / HPC, FSx for Windows = SMB + AD integration',
  },
  {
    id: 'aws-backup',
    name: 'AWS Backup',
    fullName: 'AWS Backup',
    category: 'Storage',
    description: 'ตั้งนโยบายสำรองข้อมูลจากจุดเดียว ครอบคลุมหลายบริการ AWS',
    answer:
      'บริการ backup แบบรวมศูนย์ที่สร้าง backup plan (ตารางเวลา + ระยะเก็บรักษา) ใช้กับ EBS, EC2, RDS, DynamoDB, EFS, FSx, S3 และ Storage Gateway ได้ในที่เดียว รองรับการสำรองข้ามบัญชีและข้าม region',
    hint: 'แทนที่จะไปตั้ง snapshot ทีละบริการ ให้ AWS Backup คุมทั้งหมดด้วย policy เดียว',
    examTips: 'คำใบ้คือ "centralize and automate backups across AWS services" — คำตอบคือ AWS Backup',
  },
  {
    id: 'elastic-disaster-recovery',
    name: 'Elastic Disaster Recovery',
    fullName: 'AWS Elastic Disaster Recovery (DRS)',
    category: 'Storage',
    description: 'สำเนาเซิร์ฟเวอร์ต่อเนื่องไว้บน AWS เพื่อกู้ระบบได้ในไม่กี่นาที',
    answer:
      'บริการ disaster recovery ที่ทำ block-level replication ของเซิร์ฟเวอร์ (on-premises หรือคลาวด์อื่น) มาเก็บใน staging area ราคาถูกบน AWS แล้ว launch เป็น EC2 ได้ทันทีเมื่อเกิดเหตุ ให้ RPO เป็นวินาทีและ RTO เป็นนาที',
    hint: 'ชื่อเดิมคือ CloudEndure Disaster Recovery — ใช้เทคโนโลยีเดียวกับ Application Migration Service',
    examTips: 'โจทย์ที่ต้องการ "RPO/RTO ต่ำ" และ "กู้เซิร์ฟเวอร์ on-premises ไปที่ AWS" ให้ตอบ Elastic Disaster Recovery',
  },

  // --------------------------------------------------------------- Database (8)
  {
    id: 'rds',
    name: 'RDS',
    fullName: 'Relational Database Service',
    category: 'Database',
    description: 'ฐานข้อมูลเชิงสัมพันธ์แบบ managed ที่ AWS ดูแล patch และ backup ให้',
    answer:
      'managed relational database รองรับ MySQL, PostgreSQL, MariaDB, Oracle, SQL Server และ Aurora มี automated backup, Multi-AZ สำหรับ high availability และ Read Replica สำหรับกระจายภาระการอ่าน',
    hint: 'ต้องใช้ SQL และ schema แบบตาราง แต่ไม่อยากดูแลเซิร์ฟเวอร์ฐานข้อมูลเอง',
    examTips:
      'ข้อสอบชอบแยก Multi-AZ (เพื่อ availability, synchronous, ไม่ใช้อ่าน) กับ Read Replica (เพื่อ performance, asynchronous)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    fullName: 'Amazon Aurora',
    category: 'Database',
    description: 'ฐานข้อมูลเชิงสัมพันธ์ของ AWS ที่เข้ากันได้กับ MySQL และ PostgreSQL',
    answer:
      'cloud-native relational database ที่เร็วกว่า MySQL ทั่วไปถึง 5 เท่าและ PostgreSQL 3 เท่า เก็บข้อมูล 6 สำเนาใน 3 AZ และมีโหมด Aurora Serverless ที่ปรับความจุอัตโนมัติ',
    hint: 'อยากได้ประสิทธิภาพและความทนทานสูงกว่า RDS ปกติ แต่ยังใช้ MySQL/PostgreSQL เดิม',
    examTips: 'Aurora Serverless เหมาะกับ workload ที่ traffic ขึ้นลงไม่แน่นอนหรือใช้เป็นช่วง ๆ',
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    fullName: 'Amazon DynamoDB',
    category: 'Database',
    description: 'ฐานข้อมูล NoSQL แบบ key-value ที่ตอบสนองระดับมิลลิวินาทีและไม่มีเซิร์ฟเวอร์',
    answer:
      'serverless NoSQL database แบบ key-value และ document สเกลได้ไม่จำกัด latency ระดับ single-digit millisecond มี Global Tables สำหรับ multi-region และ DAX สำหรับ cache ระดับไมโครวินาที',
    hint: 'คำใบ้คือ "NoSQL", "key-value", "serverless database" หรือ "ต้องรองรับทราฟฟิกพุ่งสูงมาก"',
    examTips: 'DynamoDB เป็น serverless และ multi-AZ ให้อยู่แล้วโดยไม่ต้องตั้งค่า ต่างจาก RDS ที่ต้องเลือก Multi-AZ',
  },
  {
    id: 'elasticache',
    name: 'ElastiCache',
    fullName: 'Amazon ElastiCache',
    category: 'Database',
    description: 'หน่วยความจำแคชแบบ managed สำหรับ Redis และ Memcached',
    answer:
      'in-memory cache ที่ช่วยลดภาระฐานข้อมูลและลด latency รองรับ Redis (มี persistence, replication, pub/sub) และ Memcached (เรียบง่าย ขยายแนวนอน)',
    hint: 'ฐานข้อมูลถูกอ่านซ้ำ ๆ ด้วยคำสั่งเดิม ให้เอาผลลัพธ์ไปพักไว้ในแคช',
    examTips: 'โจทย์ที่พูดถึง "session store" หรือ "ลด latency ของการอ่านซ้ำ" มักตอบ ElastiCache',
  },
  {
    id: 'redshift',
    name: 'Redshift',
    fullName: 'Amazon Redshift',
    category: 'Database',
    description: 'คลังข้อมูล (data warehouse) สำหรับวิเคราะห์ข้อมูลขนาดใหญ่ด้วย SQL',
    answer:
      'data warehouse แบบ petabyte-scale ที่เก็บข้อมูลแบบ columnar และประมวลผลแบบขนาน (MPP) เหมาะกับงาน OLAP, business intelligence และ reporting',
    hint: 'คำใบ้คือ "data warehouse", "analytics", "BI" หรือ "รายงานจากข้อมูลย้อนหลังหลายปี"',
    examTips: 'Redshift = OLAP (วิเคราะห์), RDS/Aurora = OLTP (ธุรกรรมรายวัน) — ข้อสอบชอบให้แยกสองอย่างนี้',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    fullName: 'Amazon Neptune',
    category: 'Database',
    description: 'ฐานข้อมูลกราฟสำหรับข้อมูลที่เน้นความสัมพันธ์ระหว่างสิ่งต่าง ๆ',
    answer:
      'managed graph database รองรับ Gremlin, openCypher และ SPARQL เหมาะกับ social network, ระบบแนะนำสินค้า, knowledge graph และการตรวจจับการฉ้อโกงจากเครือข่ายความสัมพันธ์',
    hint: 'ถ้าโจทย์พูดถึง "ความสัมพันธ์ที่ซับซ้อน" หรือ "graph" ให้ตอบ Neptune',
    examTips: 'จำคู่คำ: graph database = Neptune',
  },
  {
    id: 'documentdb',
    name: 'DocumentDB',
    fullName: 'Amazon DocumentDB',
    category: 'Database',
    description: 'ฐานข้อมูลเอกสารที่เข้ากันได้กับ MongoDB',
    answer:
      'managed document database ที่รองรับ MongoDB API และ driver เดิม เก็บข้อมูลเป็น JSON document แยก compute กับ storage เพื่อสเกลได้อิสระ',
    hint: 'ทีมใช้ MongoDB อยู่แล้วและอยากเลิกดูแลเซิร์ฟเวอร์เอง',
    examTips: 'จำคู่คำ: MongoDB-compatible = DocumentDB',
  },
  {
    id: 'qldb',
    name: 'QLDB',
    fullName: 'Quantum Ledger Database',
    category: 'Database',
    description: 'ฐานข้อมูลบัญชีแยกประเภทที่บันทึกทุกการเปลี่ยนแปลงและแก้ย้อนหลังไม่ได้',
    answer:
      'ledger database ที่เก็บ journal แบบ immutable และตรวจสอบความถูกต้องได้ด้วย cryptographic hash เหมาะกับ audit trail ทางการเงินและประวัติการเปลี่ยนแปลงข้อมูล',
    hint: 'คำใบ้คือ "immutable", "ตรวจสอบย้อนหลังได้", "ประวัติที่แก้ไขไม่ได้" โดยมีเจ้าของระบบรายเดียว',
    examTips: 'QLDB มี central authority รายเดียว ต่างจาก Managed Blockchain ที่มีหลายฝ่ายร่วมกัน',
  },

  // -------------------------------------------------------------- Analytics (5)
  {
    id: 'athena',
    name: 'Athena',
    fullName: 'Amazon Athena',
    category: 'Analytics',
    description: 'คิวรีไฟล์ใน S3 ด้วย SQL ได้ทันทีโดยไม่ต้องตั้งเซิร์ฟเวอร์',
    answer:
      'serverless interactive query service ที่รัน SQL ตรงบนข้อมูลใน S3 (CSV, JSON, Parquet) ไม่ต้องโหลดข้อมูลเข้าฐานข้อมูลก่อน จ่ายตามปริมาณข้อมูลที่สแกน',
    hint: 'มี log หรือไฟล์กองอยู่ใน S3 แล้วอยากถาม SQL เดี๋ยวนี้เลย ให้ใช้ Athena',
    examTips: 'คำใบ้คือ "serverless" + "SQL" + "S3" — Athena ไม่ใช่ data warehouse แบบ Redshift',
  },
  {
    id: 'emr',
    name: 'EMR',
    fullName: 'Amazon EMR',
    category: 'Analytics',
    description: 'คลัสเตอร์ big data สำเร็จรูปสำหรับ Hadoop และ Spark',
    answer:
      'managed big data platform ที่รัน framework open-source อย่าง Apache Spark, Hadoop, Hive และ Presto บนคลัสเตอร์ EC2 (หรือ EMR Serverless) เพื่อประมวลผลข้อมูลขนาดใหญ่',
    hint: 'ชื่อเดิมคือ Elastic MapReduce — ถ้าโจทย์พูดถึง Hadoop หรือ Spark ให้นึกถึง EMR',
    examTips: 'จำคู่คำ: Hadoop/Spark = EMR, SQL บน S3 = Athena, ETL แบบ serverless = Glue',
  },
  {
    id: 'glue',
    name: 'Glue',
    fullName: 'AWS Glue',
    category: 'Analytics',
    description: 'บริการ ETL แบบ serverless พร้อม Data Catalog กลาง',
    answer:
      'serverless data integration service ที่ค้นหาข้อมูล (crawler), เก็บ schema ไว้ใน Glue Data Catalog และรัน ETL job เพื่อแปลงและย้ายข้อมูลไปยัง data lake หรือ data warehouse',
    hint: 'Glue = "กาว" ที่ดึงข้อมูลจากหลายแหล่งมาแปลงแล้วต่อเข้าด้วยกัน',
    examTips: 'คำใบ้คือ "ETL (extract, transform, load)" หรือ "data catalog" — คำตอบคือ Glue',
  },
  {
    id: 'opensearch',
    name: 'OpenSearch Service',
    fullName: 'Amazon OpenSearch Service',
    category: 'Analytics',
    description: 'ค้นหาข้อความและวิเคราะห์ log แบบเรียลไทม์ (สืบทอดจาก Elasticsearch)',
    answer:
      'managed service สำหรับ OpenSearch (และ Elasticsearch รุ่นเดิม) ใช้ทำ full-text search, log analytics และ observability พร้อมแดชบอร์ด OpenSearch Dashboards',
    hint: 'ชื่อเดิมคือ Amazon Elasticsearch Service — ช่องค้นหาสินค้าในเว็บหรือวิเคราะห์ log แบบ real-time',
    examTips: 'คำใบ้คือ "search", "log analytics" หรือ "Elasticsearch" — คำตอบคือ OpenSearch Service',
  },
  {
    id: 'quicksight',
    name: 'QuickSight',
    fullName: 'Amazon QuickSight (ส่วนหนึ่งของ Amazon Quick Suite)',
    category: 'Analytics',
    description: 'เครื่องมือ BI สร้างแดชบอร์ดและกราฟจากข้อมูล',
    answer:
      'บริการ business intelligence แบบ serverless ที่สร้างแดชบอร์ดและรายงานแบบโต้ตอบได้ ดึงข้อมูลจาก S3, Athena, Redshift, RDS และแหล่งอื่น ถามคำถามเป็นภาษาธรรมชาติได้ จ่ายตามผู้ใช้',
    hint: 'ผู้บริหารอยากดูกราฟยอดขาย — ข้อมูลอยู่ใน Redshift ส่วนภาพที่โชว์มาจาก QuickSight',
    examTips: 'คำใบ้คือ "visualization", "dashboard" หรือ "BI" — คำตอบคือ QuickSight (exam guide ล่าสุดเรียกว่า Amazon Quick)',
  },

  // ------------------------------------------------------------- Networking (14)
  {
    id: 'vpc',
    name: 'VPC',
    fullName: 'Virtual Private Cloud',
    category: 'Networking',
    description: 'เครือข่ายส่วนตัวของเราใน AWS ที่กำหนด IP range และ subnet ได้เอง',
    answer:
      'เครือข่ายเสมือนแยกส่วน (logically isolated) ที่เรากำหนด CIDR block, public/private subnet, route table, Internet Gateway และ security control ได้เอง',
    hint: 'VPC ผูกกับ Region เดียวและ subnet หนึ่งอันอยู่ได้แค่ AZ เดียว',
    examTips: 'VPC ไม่มีค่าใช้จ่ายในตัวเอง แต่ NAT Gateway, VPN และ data transfer มีค่าใช้จ่าย',
  },
  {
    id: 'security-groups',
    name: 'Security Groups',
    fullName: 'VPC Security Groups',
    category: 'Networking',
    description: 'ไฟร์วอลล์ระดับ instance ที่จำสถานะการเชื่อมต่อได้ (stateful)',
    answer:
      'virtual firewall ที่ผูกกับ ENI ของ instance ตั้งได้เฉพาะกฎ allow และเป็น stateful คือขาเข้าที่อนุญาตแล้วขาออกตอบกลับได้อัตโนมัติ',
    hint: 'จำว่า Security Group เป็น "ยามประจำตัวเครื่อง" ส่วน NACL เป็น "ยามหน้าปากซอย subnet"',
    examTips:
      'Security Group มีแต่ allow rule ไม่มี deny — ถ้าโจทย์ต้องการบล็อก IP เฉพาะรายต้องใช้ Network ACL',
  },
  {
    id: 'nacls',
    name: 'Network ACLs',
    fullName: 'Network Access Control Lists',
    category: 'Networking',
    description: 'ไฟร์วอลล์ระดับ subnet ที่ไม่จำสถานะ (stateless) และตั้ง deny ได้',
    answer:
      'ชั้นควบคุมทราฟฟิกที่ผูกกับ subnet ตั้งได้ทั้ง allow และ deny ประเมินกฎตามลำดับหมายเลข และเป็น stateless คือต้องเขียนกฎขาเข้าและขาออกแยกกัน',
    hint: 'ต้องการบล็อก IP ที่โจมตีทั้ง subnet ให้ใช้ NACL',
    examTips: 'จำให้แม่น: SG = stateful, instance-level, allow เท่านั้น / NACL = stateless, subnet-level, allow + deny',
  },
  {
    id: 'route-53',
    name: 'Route 53',
    fullName: 'Amazon Route 53',
    category: 'Networking',
    description: 'บริการ DNS และจดโดเมน พร้อมนโยบายกระจายทราฟฟิกและ health check',
    answer:
      'managed DNS ที่แปลงชื่อโดเมนเป็น IP รองรับ routing policy หลายแบบ (simple, weighted, latency, failover, geolocation, multivalue) จดทะเบียนโดเมนและทำ health check ได้',
    hint: 'ชื่อ 53 มาจากพอร์ต DNS คือพอร์ต 53',
    examTips: 'โจทย์ disaster recovery ที่ต้องสลับไป region สำรองอัตโนมัติ มักตอบ Route 53 failover routing',
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    fullName: 'Amazon CloudFront',
    category: 'Networking',
    description: 'CDN ที่แคชเนื้อหาไว้ตาม edge location ทั่วโลกเพื่อลด latency',
    answer:
      'Content Delivery Network ที่กระจายไฟล์และเนื้อหาผ่าน edge location กว่า 400 แห่ง ลด latency ให้ผู้ใช้ปลายทาง รองรับ HTTPS, Origin Access Control และรวมกับ AWS Shield/WAF',
    hint: 'ผู้ใช้อยู่ทั่วโลกแต่ origin อยู่ region เดียว ให้เอา CloudFront มาแคชไว้ใกล้ผู้ใช้',
    examTips: 'CloudFront ช่วยลดค่า data transfer จาก origin และป้องกัน DDoS ชั้นแรกร่วมกับ Shield Standard',
  },
  {
    id: 'elb',
    name: 'ELB',
    fullName: 'Elastic Load Balancing',
    category: 'Networking',
    description: 'กระจายทราฟฟิกไปหลายเป้าหมายข้าม AZ พร้อมตรวจสุขภาพเป้าหมาย',
    answer:
      'บริการ load balancer ที่มี 4 ชนิด: Application Load Balancer (HTTP/HTTPS ระดับ layer 7), Network Load Balancer (TCP/UDP layer 4 ประสิทธิภาพสูง), Gateway Load Balancer (สำหรับ appliance) และ Classic Load Balancer (รุ่นเก่า)',
    hint: 'ALB สำหรับเว็บและ path-based routing, NLB เมื่อต้องการ static IP หรือ throughput สูงมาก',
    examTips: 'ELB ทำ health check และกระจายภาระข้าม AZ จึงเป็นองค์ประกอบสำคัญของ high availability',
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    fullName: 'Amazon API Gateway',
    category: 'Networking',
    description: 'ประตูหน้าบ้านสำหรับ API ที่จัดการ auth, throttling และ caching',
    answer:
      'managed service สำหรับสร้างและเผยแพร่ REST, HTTP และ WebSocket API รองรับ authorization, request throttling, caching, versioning และเชื่อมกับ Lambda ได้โดยตรง',
    hint: 'สถาปัตยกรรม serverless ทั่วไปคือ API Gateway + Lambda + DynamoDB',
    examTips: 'คำใบ้คือ "expose API แบบ serverless" หรือ "ต้องจำกัดอัตราการเรียก (throttle)"',
  },
  {
    id: 'direct-connect',
    name: 'Direct Connect',
    fullName: 'AWS Direct Connect',
    category: 'Networking',
    description: 'สายเชื่อมต่อเฉพาะจาก data center ถึง AWS โดยไม่ผ่านอินเทอร์เน็ต',
    answer:
      'การเชื่อมต่อแบบ dedicated private network ระหว่าง on-premises กับ AWS ให้ bandwidth คงที่ latency สม่ำเสมอ และไม่วิ่งผ่านอินเทอร์เน็ตสาธารณะ',
    hint: 'คำใบ้คือ "consistent network performance" หรือ "ต้องการ bandwidth สูงและเสถียรระยะยาว"',
    examTips: 'Direct Connect ใช้เวลาติดตั้งเป็นสัปดาห์ถึงเดือน — ถ้าโจทย์ต้องการเร็ววันนี้ให้ตอบ Site-to-Site VPN',
  },
  {
    id: 'site-to-site-vpn',
    name: 'Site-to-Site VPN',
    fullName: 'AWS Site-to-Site VPN',
    category: 'Networking',
    description: 'อุโมงค์เข้ารหัสผ่านอินเทอร์เน็ตเชื่อมเครือข่ายองค์กรกับ VPC',
    answer:
      'IPsec VPN tunnel ที่เชื่อม on-premises network กับ VPC ผ่านอินเทอร์เน็ต ตั้งได้ในไม่กี่นาทีและมีค่าใช้จ่ายต่ำ แต่ประสิทธิภาพขึ้นกับอินเทอร์เน็ต',
    hint: 'ทางเลือกที่ตั้งเร็วและถูกกว่า Direct Connect หรือใช้เป็น backup ของ Direct Connect',
    examTips: 'โจทย์ที่ต้องการเชื่อม hybrid "อย่างรวดเร็วและประหยัด" ให้ตอบ VPN ไม่ใช่ Direct Connect',
  },
  {
    id: 'transit-gateway',
    name: 'Transit Gateway',
    fullName: 'AWS Transit Gateway',
    category: 'Networking',
    description: 'ฮับกลางที่เชื่อม VPC หลายอันและเครือข่าย on-premises เข้าด้วยกัน',
    answer:
      'network transit hub แบบ hub-and-spoke ที่เชื่อม VPC จำนวนมาก, VPN และ Direct Connect เข้าด้วยกัน แทนการทำ VPC peering แบบ full mesh ที่จัดการยาก',
    hint: 'มี VPC 30 อันต้องคุยกันหมด ถ้าใช้ peering จะเป็นใยแมงมุม ให้เอา Transit Gateway มาเป็นศูนย์กลาง',
    examTips: 'คำใบ้คือ "simplify network topology" หรือ "เชื่อม VPC จำนวนมากแบบรวมศูนย์"',
  },
  {
    id: 'nat-gateway',
    name: 'NAT Gateway',
    fullName: 'Network Address Translation Gateway',
    category: 'Networking',
    description: 'ให้เครื่องใน private subnet ออกอินเทอร์เน็ตได้แต่ห้ามเชื่อมเข้ามา',
    answer:
      'managed NAT service ที่วางใน public subnet เพื่อให้ instance ใน private subnet เรียกออกอินเทอร์เน็ต (เช่น ดาวน์โหลด patch) ได้ โดยอินเทอร์เน็ตเปิดการเชื่อมต่อเข้ามาไม่ได้',
    hint: 'ออกได้ เข้าไม่ได้ — นี่คือหัวใจของ NAT Gateway',
    examTips: 'NAT Gateway คิดค่าใช้จ่ายรายชั่วโมงบวกค่าข้อมูลที่ผ่าน และควรวางหนึ่งตัวต่อ AZ เพื่อความทนทาน',
  },
  {
    id: 'global-accelerator',
    name: 'Global Accelerator',
    fullName: 'AWS Global Accelerator',
    category: 'Networking',
    description: 'ให้ static IP ระดับโลกและส่งทราฟฟิกผ่านโครงข่ายภายในของ AWS',
    answer:
      'บริการที่ให้ anycast static IP สองหมายเลข และนำทราฟฟิกเข้าสู่ AWS global network ที่ edge ทันที ทำให้ latency ต่ำและ failover ข้าม region เร็ว',
    hint: 'ต่างจาก CloudFront ที่แคชเนื้อหา — Global Accelerator ไม่แคช แต่เร่งเส้นทางเครือข่าย',
    examTips: 'โจทย์ non-HTTP (เช่น เกม, VoIP, TCP/UDP) ที่ต้องการ static IP และ latency ต่ำ ให้ตอบ Global Accelerator',
  },
  {
    id: 'privatelink',
    name: 'PrivateLink',
    fullName: 'AWS PrivateLink',
    category: 'Networking',
    description: 'เข้าถึงบริการ AWS หรือบริการของบัญชีอื่นแบบส่วนตัว ไม่ผ่านอินเทอร์เน็ต',
    answer:
      'เทคโนโลยีที่สร้าง interface VPC endpoint ใน subnet ของเรา เพื่อเชื่อมไปยังบริการ AWS, บริการของพาร์ตเนอร์ หรือบริการในบัญชีอื่น ผ่านเครือข่ายภายในของ AWS โดยไม่ต้องใช้ Internet Gateway, NAT หรือ VPC peering',
    hint: 'อยากให้ EC2 ใน private subnet คุยกับบริการอื่นโดยทราฟฟิกไม่เคยออกอินเทอร์เน็ต',
    examTips: 'คำใบ้คือ "private connectivity" + "ไม่ expose ทราฟฟิกสู่ public internet" — คำตอบคือ PrivateLink',
  },
  {
    id: 'client-vpn',
    name: 'Client VPN',
    fullName: 'AWS Client VPN',
    category: 'Networking',
    description: 'VPN ให้พนักงานแต่ละคนต่อเข้า AWS หรือเครือข่ายองค์กรจากที่ไหนก็ได้',
    answer:
      'managed client-based VPN (OpenVPN) ที่ให้ผู้ใช้แต่ละคนเชื่อมจากโน้ตบุ๊กหรืออุปกรณ์ของตัวเองเข้าสู่ VPC และเครือข่าย on-premises อย่างปลอดภัย สเกลตามจำนวนผู้ใช้อัตโนมัติ',
    hint: 'Client VPN = คนต่อเข้าเครือข่าย, Site-to-Site VPN = ออฟฟิศทั้งออฟฟิศต่อเข้า VPC',
    examTips: 'โจทย์ "พนักงานทำงานจากบ้านต้องเข้าทรัพยากรใน VPC" ให้ตอบ Client VPN ไม่ใช่ Site-to-Site VPN',
  },

  // --------------------------------------------------------------- Security (20)
  {
    id: 'iam',
    name: 'IAM',
    fullName: 'Identity and Access Management',
    category: 'Security',
    description: 'ระบบจัดการผู้ใช้ กลุ่ม role และสิทธิ์การเข้าถึงทรัพยากร AWS',
    answer:
      'บริการควบคุมตัวตนและสิทธิ์ ประกอบด้วย user, group, role และ policy (JSON) ทำงานแบบ global ไม่ผูก region และใช้ฟรีไม่มีค่าใช้จ่าย',
    hint: 'หลักการสำคัญคือ least privilege และใช้ role แทนการฝัง access key ไว้ในโค้ด',
    examTips:
      'root user ควรเปิด MFA และไม่ใช้ทำงานประจำ — ข้อสอบถามเรื่องนี้บ่อย และ IAM policy เป็น deny by default',
  },
  {
    id: 'iam-identity-center',
    name: 'IAM Identity Center',
    fullName: 'AWS IAM Identity Center (AWS SSO)',
    category: 'Security',
    description: 'ล็อกอินครั้งเดียวเข้าได้หลายบัญชี AWS และแอปภายนอก',
    answer:
      'บริการ single sign-on ที่รวมศูนย์การเข้าถึงหลาย AWS account ใน Organizations และแอป SaaS เชื่อมกับ identity provider ภายนอกเช่น Active Directory หรือ Okta ได้',
    hint: 'ชื่อเดิมคือ AWS SSO — โจทย์ยังใช้สองชื่อสลับกัน',
    examTips: 'โจทย์ที่บอกว่า "ผู้ใช้ต้องเข้าหลายบัญชีด้วย credential ชุดเดียว" ให้ตอบ IAM Identity Center',
  },
  {
    id: 'kms',
    name: 'KMS',
    fullName: 'Key Management Service',
    category: 'Security',
    description: 'สร้างและจัดการกุญแจเข้ารหัสที่ใช้ร่วมกับบริการ AWS อื่น',
    answer:
      'บริการจัดการ encryption key แบบรวมศูนย์ รองรับ AWS managed key และ customer managed key (CMK) หมุนกุญแจอัตโนมัติได้ และผสานกับ S3, EBS, RDS พร้อมบันทึกการใช้กุญแจลง CloudTrail',
    hint: 'KMS ใช้ hardware security module แบบแชร์ ส่วน CloudHSM เป็น HSM เฉพาะของเรา',
    examTips: 'โจทย์ encryption at rest ทั่วไปให้ตอบ KMS — เลือก CloudHSM เฉพาะเมื่อโจทย์ระบุ FIPS 140-2 Level 3 หรือต้องคุมกุญแจเองทั้งหมด',
  },
  {
    id: 'cloudhsm',
    name: 'CloudHSM',
    fullName: 'AWS CloudHSM',
    category: 'Security',
    description: 'อุปกรณ์ HSM เฉพาะของเราที่ AWS เข้าถึงกุญแจไม่ได้เลย',
    answer:
      'hardware security module แบบ single-tenant ที่ผ่านมาตรฐาน FIPS 140-2 Level 3 ลูกค้าถือกุญแจและควบคุมทั้งหมด AWS ไม่มีสิทธิ์เข้าถึงกุญแจ',
    hint: 'คำใบ้คือ "ต้องควบคุมกุญแจเองทั้งหมด" หรือข้อกำหนด compliance ที่เข้มงวดมาก',
    examTips: 'ต่างจาก KMS ที่เป็น multi-tenant และ AWS ร่วมจัดการ — CloudHSM คือ dedicated hardware',
  },
  {
    id: 'shield',
    name: 'Shield',
    fullName: 'AWS Shield',
    category: 'Security',
    description: 'ป้องกันการโจมตีแบบ DDoS ให้บริการที่เปิดสู่อินเทอร์เน็ต',
    answer:
      'บริการป้องกัน DDoS สองระดับ: Shield Standard เปิดให้ทุกบัญชีฟรีอัตโนมัติ และ Shield Advanced ที่มีทีม DDoS Response Team, รายงานเชิงลึก และ cost protection',
    hint: 'DDoS = Shield, การโจมตีระดับแอปเช่น SQL injection = WAF',
    examTips: 'Shield Standard ฟรีและเปิดอยู่แล้ว ส่วน Shield Advanced มีค่าบริการรายเดือนและคุ้มเมื่อเป็นเป้าโจมตีบ่อย',
  },
  {
    id: 'waf',
    name: 'WAF',
    fullName: 'AWS Web Application Firewall',
    category: 'Security',
    description: 'กรองทราฟฟิกเว็บระดับ layer 7 ตามกฎที่กำหนด',
    answer:
      'web application firewall ที่วางหน้า CloudFront, ALB, API Gateway หรือ AppSync เพื่อบล็อก SQL injection, cross-site scripting, บอท และจำกัดอัตราการเรียกตาม IP',
    hint: 'คำใบ้ในโจทย์คือชื่อช่องโหว่ระดับแอปพลิเคชัน เช่น SQL injection หรือ XSS',
    examTips: 'WAF = layer 7 (HTTP), Shield = layer 3/4 (network/transport) — ข้อสอบชอบให้แยกสองตัวนี้',
  },
  {
    id: 'guardduty',
    name: 'GuardDuty',
    fullName: 'Amazon GuardDuty',
    category: 'Security',
    description: 'ตรวจจับพฤติกรรมผิดปกติและภัยคุกคามจาก log อย่างต่อเนื่อง',
    answer:
      'threat detection service ที่ใช้ machine learning วิเคราะห์ CloudTrail, VPC Flow Logs และ DNS logs เพื่อหาพฤติกรรมน่าสงสัย เช่น การขุดคริปโต หรือ credential ที่ถูกขโมย',
    hint: 'คำใบ้คือ "intelligent threat detection" — เปิดใช้ได้ในคลิกเดียว ไม่ต้องติดตั้ง agent',
    examTips: 'GuardDuty = ตรวจจับภัยคุกคาม, Inspector = สแกนช่องโหว่, Macie = ค้นหาข้อมูลอ่อนไหว',
  },
  {
    id: 'inspector',
    name: 'Inspector',
    fullName: 'Amazon Inspector',
    category: 'Security',
    description: 'สแกนช่องโหว่ของ EC2, container image และ Lambda อัตโนมัติ',
    answer:
      'automated vulnerability management ที่สแกน EC2 instance, container image ใน ECR และ Lambda function เทียบกับฐานข้อมูล CVE แล้วให้คะแนนความเสี่ยง',
    hint: 'จำว่า Inspector "ตรวจสุขภาพ workload" หาช่องโหว่ซอฟต์แวร์และการตั้งค่าเครือข่าย',
    examTips: 'โจทย์ที่พูดถึง "vulnerability" หรือ "CVE" ให้ตอบ Inspector',
  },
  {
    id: 'macie',
    name: 'Macie',
    fullName: 'Amazon Macie',
    category: 'Security',
    description: 'ค้นหาข้อมูลอ่อนไหวเช่นเลขบัตรและ PII ที่เก็บอยู่ใน S3',
    answer:
      'บริการที่ใช้ machine learning ค้นหาและจัดประเภทข้อมูลอ่อนไหว (PII, ข้อมูลบัตรเครดิต, credential) ใน S3 bucket แล้วแจ้งเตือนความเสี่ยงด้านความเป็นส่วนตัว',
    hint: 'จำคู่คำ: Macie + S3 + PII',
    examTips: 'ถ้าโจทย์ระบุว่าต้องค้นหาข้อมูลส่วนบุคคลใน S3 คำตอบคือ Macie เท่านั้น',
  },
  {
    id: 'security-hub',
    name: 'Security Hub',
    fullName: 'AWS Security Hub',
    category: 'Security',
    description: 'แดชบอร์ดรวมผลตรวจความปลอดภัยจากหลายบริการไว้ที่เดียว',
    answer:
      'ศูนย์รวม security finding จาก GuardDuty, Inspector, Macie และเครื่องมือของพาร์ตเนอร์ พร้อมตรวจสอบการปฏิบัติตามมาตรฐาน เช่น CIS AWS Foundations และ PCI DSS',
    hint: 'คำใบ้คือ "single pane of glass" หรือ "มุมมองรวมความปลอดภัยทุกบัญชี"',
    examTips: 'Security Hub ไม่ตรวจเอง แต่รวบรวมผลจากบริการอื่นมาแสดงและให้คะแนน compliance',
  },
  {
    id: 'cloudtrail',
    name: 'CloudTrail',
    fullName: 'AWS CloudTrail',
    category: 'Security',
    description: 'บันทึกว่าใครเรียก API อะไร เมื่อไร จากที่ไหน เพื่อการตรวจสอบ',
    answer:
      'บริการ audit log ที่บันทึกทุก API call และการกระทำในบัญชี ทั้งจาก Console, CLI และ SDK เก็บ event history 90 วันโดยค่าเริ่มต้น และส่งต่อเข้า S3 หรือ CloudWatch Logs ได้',
    hint: 'จำประโยคนี้: CloudTrail = "ใครทำอะไร", CloudWatch = "ระบบเป็นอย่างไร"',
    examTips: 'โจทย์เกี่ยวกับ governance, audit หรือสอบสวนย้อนหลังว่าใครลบทรัพยากร ให้ตอบ CloudTrail',
  },
  {
    id: 'config',
    name: 'Config',
    fullName: 'AWS Config',
    category: 'Security',
    description: 'ติดตามการตั้งค่าทรัพยากรและตรวจว่าตรงตามกฎที่กำหนดหรือไม่',
    answer:
      'บริการบันทึก configuration history ของทรัพยากร ดูย้อนหลังได้ว่าการตั้งค่าเปลี่ยนอย่างไร และตั้ง Config Rule เพื่อตรวจ compliance พร้อม remediation อัตโนมัติ',
    hint: 'คำใบ้คือ "configuration change" หรือ "ทรัพยากรตอนนี้ตั้งค่าตรงตามนโยบายไหม"',
    examTips: 'CloudTrail = การกระทำ (action), Config = สถานะการตั้งค่า (state) — อย่าสับสน',
  },
  {
    id: 'artifact',
    name: 'Artifact',
    fullName: 'AWS Artifact',
    category: 'Security',
    description: 'ที่ดาวน์โหลดรายงาน compliance และข้อตกลงของ AWS เช่น SOC และ ISO',
    answer:
      'พอร์ทัลสำหรับเข้าถึงเอกสาร compliance ของ AWS เช่น SOC 1/2/3, ISO 27001, PCI DSS และจัดการข้อตกลงอย่าง Business Associate Addendum (BAA) ใช้ฟรี',
    hint: 'ผู้ตรวจสอบขอหลักฐานว่า AWS ได้รับการรับรองมาตรฐานอะไร ให้ไปโหลดจาก Artifact',
    examTips: 'โจทย์ที่บอกว่า "auditor ขอรายงาน compliance" คำตอบคือ AWS Artifact',
  },
  {
    id: 'acm',
    name: 'ACM',
    fullName: 'AWS Certificate Manager',
    category: 'Security',
    description: 'ออกและต่ออายุใบรับรอง SSL/TLS ให้ฟรีและอัตโนมัติ',
    answer:
      'บริการจัดการ SSL/TLS certificate ที่ออกใบรับรองสาธารณะให้ฟรี ต่ออายุอัตโนมัติ และติดตั้งเข้ากับ CloudFront, ALB และ API Gateway ได้โดยตรง',
    hint: 'คำใบ้คือ "HTTPS" + "ไม่อยากต่ออายุ certificate เองทุกปี"',
    examTips: 'ใบรับรองสาธารณะจาก ACM ฟรี แต่ใช้ได้กับบริการที่ผสานกันเท่านั้น (ไม่สามารถ export ไปใช้บน EC2 เองได้)',
  },
  {
    id: 'secrets-manager',
    name: 'Secrets Manager',
    fullName: 'AWS Secrets Manager',
    category: 'Security',
    description: 'เก็บรหัสผ่านและ API key อย่างปลอดภัยพร้อมหมุนเวียนอัตโนมัติ',
    answer:
      'บริการเก็บ secret เช่น database credential และ API key โดยเข้ารหัสด้วย KMS และหมุนเวียนรหัสผ่าน (automatic rotation) ให้อัตโนมัติ พร้อมควบคุมสิทธิ์ผ่าน IAM',
    hint: 'ต่างจาก Systems Manager Parameter Store ที่ฟรีแต่ไม่มี rotation อัตโนมัติ',
    examTips: 'คำใบ้ที่ชี้ชัดคือ "automatic credential rotation" — คำตอบคือ Secrets Manager',
  },
  {
    id: 'cognito',
    name: 'Cognito',
    fullName: 'Amazon Cognito',
    category: 'Security',
    description: 'ระบบสมัครสมาชิกและล็อกอินสำหรับผู้ใช้ของเว็บและแอปมือถือ',
    answer:
      'บริการ identity สำหรับลูกค้าของแอป (customer identity) มี User Pool สำหรับ sign-up/sign-in, MFA และล็อกอินผ่าน Google, Facebook หรือ SAML และ Identity Pool สำหรับแลก token เป็นสิทธิ์ AWS ชั่วคราว',
    hint: 'IAM = พนักงานที่ดูแลบัญชี AWS, Cognito = ผู้ใช้ปลายทางหลายล้านคนของแอปเรา',
    examTips: 'คำใบ้คือ "add sign-up and sign-in to web/mobile app" หรือ "social login" — คำตอบคือ Cognito',
  },
  {
    id: 'detective',
    name: 'Detective',
    fullName: 'Amazon Detective',
    category: 'Security',
    description: 'สืบสวนหาต้นตอของเหตุด้านความปลอดภัยด้วยกราฟความสัมพันธ์',
    answer:
      'บริการที่รวบรวม log จาก CloudTrail, VPC Flow Logs และ finding จาก GuardDuty มาสร้างเป็นกราฟพฤติกรรม เพื่อช่วยวิเคราะห์ root cause และขอบเขตของเหตุการณ์ด้านความปลอดภัย',
    hint: 'GuardDuty "เป่านกหวีด" ว่ามีอะไรผิดปกติ แล้ว Detective "สืบต่อ" ว่าเกิดจากอะไร',
    examTips: 'คำใบ้คือ "investigate", "root cause" ของ security finding — คำตอบคือ Detective ไม่ใช่ GuardDuty',
  },
  {
    id: 'directory-service',
    name: 'Directory Service',
    fullName: 'AWS Directory Service (Managed Microsoft AD)',
    category: 'Security',
    description: 'Microsoft Active Directory แบบ managed บน AWS',
    answer:
      'บริการ directory ที่ให้ใช้ Microsoft Active Directory บน AWS ได้ทั้งแบบ AWS Managed Microsoft AD, AD Connector (ส่งต่อไป AD เดิมใน on-premises) และ Simple AD ใช้ join EC2 Windows, WorkSpaces และ RDS for SQL Server เข้าโดเมน',
    hint: 'องค์กรใช้ Active Directory อยู่แล้วและอยากให้ทรัพยากรบน AWS ใช้ user ชุดเดิม',
    examTips: 'คำใบ้คือ "Active Directory" หรือ "Microsoft AD" — คำตอบคือ Directory Service',
  },
  {
    id: 'firewall-manager',
    name: 'Firewall Manager',
    fullName: 'AWS Firewall Manager',
    category: 'Security',
    description: 'ตั้งกฎไฟร์วอลล์จากจุดเดียวให้ทุกบัญชีใน Organizations',
    answer:
      'บริการบริหารกฎความปลอดภัยแบบรวมศูนย์ ใช้กำหนด WAF rule, Shield Advanced, Security Group, Network Firewall และ Route 53 Resolver DNS Firewall ให้ทุกบัญชีและทรัพยากรใหม่ใน AWS Organizations โดยอัตโนมัติ',
    hint: 'มี 50 บัญชี ไม่อยากเข้าไปตั้ง WAF ทีละบัญชี ให้ใช้ Firewall Manager',
    examTips: 'คำใบ้คือ "centrally configure firewall rules across accounts" — ต้องเปิด AWS Organizations ก่อน',
  },
  {
    id: 'ram',
    name: 'RAM',
    fullName: 'AWS Resource Access Manager',
    category: 'Security',
    description: 'แชร์ทรัพยากร AWS ให้บัญชีอื่นใช้ร่วมกันได้อย่างปลอดภัย',
    answer:
      'บริการแชร์ทรัพยากร เช่น subnet, Transit Gateway, License Manager configuration และ Route 53 Resolver rule ให้บัญชีอื่นหรือทั้ง OU ใน Organizations ใช้ได้ โดยไม่ต้องสร้างทรัพยากรซ้ำ',
    hint: 'สร้าง Transit Gateway ไว้บัญชีเดียว แล้วแชร์ให้ทุกบัญชีใช้ร่วมกันด้วย RAM',
    examTips: 'คำใบ้คือ "share resources across AWS accounts" — คำตอบคือ RAM ไม่ใช่ IAM',
  },

  // ------------------------------------------------- Serverless & Integration (5)
  {
    id: 'step-functions',
    name: 'Step Functions',
    fullName: 'AWS Step Functions',
    category: 'Serverless',
    description: 'ร้อยเรียงหลายขั้นตอนงานเป็น workflow แบบ state machine',
    answer:
      'serverless orchestration ที่กำหนด workflow เป็น state machine มองเห็นแต่ละขั้นตอนได้ จัดการ retry, error handling และ parallel branch ให้อัตโนมัติ',
    hint: 'มี Lambda หลายตัวที่ต้องทำงานต่อกันเป็นลำดับและมีเงื่อนไข ให้ใช้ Step Functions คุมแทนเขียนโค้ดเรียกกันเอง',
    examTips: 'คำใบ้คือ "coordinate multiple services" หรือ "visual workflow"',
  },
  {
    id: 'sqs',
    name: 'SQS',
    fullName: 'Simple Queue Service',
    category: 'Serverless',
    description: 'คิวข้อความที่ผู้ส่งและผู้รับทำงานแยกกันได้ (decouple)',
    answer:
      'message queue แบบ pull ที่ผู้รับดึงข้อความไปประมวลผล มีทั้ง Standard queue (throughput สูง ลำดับไม่รับประกัน) และ FIFO queue (รับประกันลำดับและส่งครั้งเดียว)',
    hint: 'คำใบ้ที่ชัดที่สุดคือ "decouple" — แยกส่วนของระบบให้ล้มแยกกันได้',
    examTips: 'SQS = หนึ่งข้อความมีผู้บริโภคเดียว (pull), SNS = หนึ่งข้อความส่งถึงผู้รับหลายราย (push)',
  },
  {
    id: 'sns',
    name: 'SNS',
    fullName: 'Simple Notification Service',
    category: 'Serverless',
    description: 'ส่งการแจ้งเตือนแบบ pub/sub ถึงผู้รับหลายรายพร้อมกัน',
    answer:
      'บริการ pub/sub ที่ publisher ส่งข้อความเข้า topic แล้ว subscriber ทุกรายได้รับพร้อมกัน รองรับ endpoint หลายแบบ เช่น Lambda, SQS, HTTP, email และ SMS',
    hint: 'รูปแบบ fan-out ที่นิยมคือ SNS ส่งเข้า SQS หลายคิวเพื่อให้แต่ละระบบประมวลผลของตัวเอง',
    examTips: 'จำว่า SNS เป็น push และเป็น one-to-many ส่วน SQS เป็น pull และ one-to-one',
  },
  {
    id: 'eventbridge',
    name: 'EventBridge',
    fullName: 'Amazon EventBridge',
    category: 'Serverless',
    description: 'บัสกลางรับส่ง event พร้อมกฎคัดกรองและตารางเวลา',
    answer:
      'serverless event bus ที่รับ event จากบริการ AWS, แอปของเราเอง และ SaaS ภายนอก แล้วส่งต่อไปยังเป้าหมายตาม rule รองรับ scheduled event แบบ cron',
    hint: 'ชื่อเดิมคือ CloudWatch Events — ตอนนี้ EventBridge ทำได้มากกว่าเพราะรับ event จาก SaaS ได้',
    examTips: 'โจทย์ที่ต้องการ "รันงานตามตารางเวลา" หรือ "event-driven architecture" มักตอบ EventBridge',
  },
  {
    id: 'kinesis',
    name: 'Kinesis',
    fullName: 'Amazon Kinesis',
    category: 'Serverless',
    description: 'รับและวิเคราะห์ข้อมูลสตรีมแบบเรียลไทม์ปริมาณมหาศาล',
    answer:
      'ตระกูลบริการ streaming data: Data Streams (สตรีมแบบ real-time), Data Firehose (ส่งเข้า S3/Redshift โดยไม่ต้องเขียนโค้ด) และ Managed Service for Apache Flink (วิเคราะห์สตรีม)',
    hint: 'คำใบ้คือ "real-time", "streaming", "clickstream" หรือ "ข้อมูลจาก IoT ไหลเข้ามาต่อเนื่อง"',
    examTips: 'Kinesis = ข้อมูลไหลต่อเนื่องแบบเรียลไทม์, SQS = คิวงานที่ต้องประมวลผลทีละชิ้น',
  },

  // ------------------------------------------------------------- Management (15)
  {
    id: 'cloudwatch',
    name: 'CloudWatch',
    fullName: 'Amazon CloudWatch',
    category: 'Management',
    description: 'เก็บ metric, log และตั้งการแจ้งเตือนสุขภาพของระบบ',
    answer:
      'บริการ monitoring และ observability ที่รวบรวม metric, CloudWatch Logs, แดชบอร์ด และ CloudWatch Alarm ที่สั่ง Auto Scaling หรือส่ง SNS เมื่อค่าผิดปกติ',
    hint: 'จำประโยคนี้: CloudWatch ดู "ระบบเป็นอย่างไร", CloudTrail ดู "ใครทำอะไร"',
    examTips: 'metric พื้นฐานเก็บทุก 5 นาที ส่วน detailed monitoring เก็บทุก 1 นาทีและมีค่าใช้จ่ายเพิ่ม',
  },
  {
    id: 'cloudformation',
    name: 'CloudFormation',
    fullName: 'AWS CloudFormation',
    category: 'Management',
    description: 'สร้าง infrastructure จากไฟล์ template แบบ Infrastructure as Code',
    answer:
      'บริการ Infrastructure as Code ที่ประกาศทรัพยากรในไฟล์ JSON หรือ YAML แล้วสร้างเป็น stack ทำซ้ำได้เหมือนกันทุก environment และ rollback อัตโนมัติเมื่อสร้างล้มเหลว',
    hint: 'คำใบ้คือ "repeatable", "template" หรือ "สร้าง environment เดิมซ้ำในอีก region"',
    examTips: 'ตัวบริการฟรี จ่ายเฉพาะทรัพยากรที่ถูกสร้าง และรองรับ drift detection',
  },
  {
    id: 'cdk',
    name: 'CDK',
    fullName: 'AWS Cloud Development Kit',
    category: 'Management',
    description: 'เขียน infrastructure ด้วยภาษาโปรแกรมจริงแล้วแปลงเป็น CloudFormation',
    answer:
      'framework ที่ให้นิยาม infrastructure ด้วย TypeScript, Python, Java, C# หรือ Go แล้ว synthesize ออกมาเป็น CloudFormation template ใช้ loop, ตัวแปรและ unit test ได้',
    hint: 'ทีมนักพัฒนาอยากใช้ภาษาที่ถนัดแทนการเขียน YAML ยาว ๆ',
    examTips: 'CDK ไม่ได้แทน CloudFormation แต่สร้าง template ให้ CloudFormation ไป deploy',
  },
  {
    id: 'systems-manager',
    name: 'Systems Manager',
    fullName: 'AWS Systems Manager',
    category: 'Management',
    description: 'ชุดเครื่องมือบริหารเครื่องจำนวนมาก ทั้ง patch, คำสั่ง และพารามิเตอร์',
    answer:
      'ชุดเครื่องมือปฏิบัติการที่รวม Patch Manager, Run Command, Session Manager (SSH เข้าเครื่องโดยไม่เปิดพอร์ต 22) และ Parameter Store สำหรับเก็บค่าคอนฟิก',
    hint: 'อยากเข้าเครื่อง EC2 โดยไม่ต้องเปิด inbound port หรือใช้ bastion host ให้ใช้ Session Manager',
    examTips: 'Parameter Store เก็บค่าคอนฟิกและ secret แบบพื้นฐานได้ฟรี ต่างจาก Secrets Manager ที่มีค่าใช้จ่ายแต่หมุนรหัสอัตโนมัติ',
  },
  {
    id: 'trusted-advisor',
    name: 'Trusted Advisor',
    fullName: 'AWS Trusted Advisor',
    category: 'Management',
    description: 'ตรวจบัญชีแล้วแนะนำการปรับปรุง 5 ด้านรวมถึงการลดค่าใช้จ่าย',
    answer:
      'เครื่องมือให้คำแนะนำอัตโนมัติ 5 หมวด: cost optimization, performance, security, fault tolerance และ service limits พร้อมชี้จุดที่ควรแก้ทันที',
    hint: 'จำ 5 เสาหลักไว้ — โจทย์มักถามว่า Trusted Advisor ตรวจอะไรบ้าง',
    examTips: 'แผน Basic และ Developer เห็นเฉพาะ check ด้าน security และ service limits บางส่วน ต้อง Business ขึ้นไปจึงเห็นครบ',
  },
  {
    id: 'organizations',
    name: 'Organizations',
    fullName: 'AWS Organizations',
    category: 'Management',
    description: 'จัดกลุ่มหลายบัญชี AWS ไว้ใต้ร่มเดียว พร้อมรวมบิลและตั้งนโยบาย',
    answer:
      'บริการบริหารหลายบัญชีแบบรวมศูนย์ จัดบัญชีเป็น Organizational Unit ใช้ Service Control Policy (SCP) จำกัดสิทธิ์สูงสุด และรวมค่าใช้จ่ายด้วย consolidated billing',
    hint: 'SCP ไม่ให้สิทธิ์ แต่กำหนด "เพดาน" ว่าบัญชีนั้นทำอะไรได้มากสุดแค่ไหน',
    examTips: 'ประโยชน์ที่ข้อสอบเน้นคือ volume discount จากการรวมการใช้งาน และการแยก environment ออกเป็นบัญชีต่างหาก',
  },
  {
    id: 'control-tower',
    name: 'Control Tower',
    fullName: 'AWS Control Tower',
    category: 'Management',
    description: 'ตั้ง landing zone หลายบัญชีตาม best practice ให้อัตโนมัติ',
    answer:
      'บริการที่สร้าง multi-account landing zone ให้อัตโนมัติ พร้อม guardrail ทั้งแบบ preventive และ detective, account factory สำหรับสร้างบัญชีใหม่ และแดชบอร์ด compliance',
    hint: 'Control Tower ทำงานบน Organizations โดยเพิ่มการตั้งค่าตาม best practice ให้ในคลิกเดียว',
    examTips: 'คำใบ้คือ "landing zone" หรือ "ตั้งสภาพแวดล้อมหลายบัญชีให้ปลอดภัยตั้งแต่วันแรก"',
  },
  {
    id: 'health-dashboard',
    name: 'Health Dashboard',
    fullName: 'AWS Health Dashboard',
    category: 'Management',
    description: 'แจ้งสถานะบริการ AWS และเหตุการณ์ที่กระทบทรัพยากรของเราโดยตรง',
    answer:
      'แดชบอร์ดแสดงสถานะบริการทั้งภาพรวม (Service health) และเหตุการณ์เฉพาะบัญชีเรา (Your account health) เช่น การบำรุงรักษาที่กระทบ instance ของเรา',
    hint: 'ต่างจากหน้า status ทั่วไป เพราะบอกได้ว่าเหตุการณ์นั้นกระทบทรัพยากรชิ้นไหนของเรา',
    examTips: 'โจทย์ที่ถามว่า "จะรู้ล่วงหน้าได้อย่างไรว่า AWS จะ maintenance เครื่องของเรา" ให้ตอบ Health Dashboard',
  },
  {
    id: 'auto-scaling',
    name: 'Auto Scaling',
    fullName: 'AWS Auto Scaling',
    category: 'Management',
    description: 'เพิ่มหรือลดจำนวนทรัพยากรอัตโนมัติตามโหลดจริง',
    answer:
      'บริการปรับขนาดทรัพยากรอัตโนมัติ เช่น EC2 Auto Scaling group, ECS task, DynamoDB capacity และ Aurora replica ตาม scaling policy (target tracking, step, scheduled) เพื่อรักษาประสิทธิภาพด้วยต้นทุนต่ำสุด',
    hint: 'ช่วงลดราคามีคนเข้าเว็บพุ่ง ระบบเพิ่มเครื่องเอง พอคนน้อยก็ลดเครื่องลงเอง',
    examTips: 'Auto Scaling ตอบทั้ง elasticity และ high availability (แทนเครื่องที่ health check ไม่ผ่าน) — มักคู่กับ ELB',
  },
  {
    id: 'compute-optimizer',
    name: 'Compute Optimizer',
    fullName: 'AWS Compute Optimizer',
    category: 'Management',
    description: 'ใช้ ML วิเคราะห์การใช้งานแล้วแนะนำขนาดทรัพยากรที่เหมาะสม (right-sizing)',
    answer:
      'บริการที่วิเคราะห์ metric การใช้งานย้อนหลังของ EC2, Auto Scaling group, EBS, Lambda และ ECS on Fargate แล้วแนะนำ instance type หรือขนาดที่เหมาะสม เพื่อลดต้นทุนหรือเพิ่มประสิทธิภาพ',
    hint: 'เครื่องใหญ่เกินไปเสียเงิน เล็กเกินไปช้า — Compute Optimizer บอกว่าขนาดไหนพอดี',
    examTips: 'คำใบ้คือ "right-size" หรือ "over-provisioned / under-provisioned" — คำตอบคือ Compute Optimizer',
  },
  {
    id: 'license-manager',
    name: 'License Manager',
    fullName: 'AWS License Manager',
    category: 'Management',
    description: 'ติดตามและคุมจำนวน license ซอฟต์แวร์ เช่น Microsoft และ Oracle',
    answer:
      'บริการจัดการ software license จากผู้ขายอย่าง Microsoft, Oracle, SAP และ IBM ทั้งบน AWS และ on-premises ตั้งกฎจำกัดการใช้งานเพื่อไม่ให้เกินสิทธิ์และลดความเสี่ยงตอนถูก audit',
    hint: 'นำ license เดิมมาใช้บนคลาวด์ (BYOL) แล้วต้องคุมไม่ให้ใช้เกินจำนวนที่ซื้อไว้',
    examTips: 'คำใบ้คือ "track license usage" หรือ "BYOL compliance" — คำตอบคือ License Manager',
  },
  {
    id: 'management-console',
    name: 'Management Console',
    fullName: 'AWS Management Console',
    category: 'Management',
    description: 'หน้าเว็บสำหรับเข้าใช้และจัดการบริการ AWS ผ่านเบราว์เซอร์',
    answer:
      'web-based user interface สำหรับสร้างและจัดการทรัพยากร AWS แบบคลิก ดูบิล เปิดเคส support และมีแอปมือถือ AWS Console Mobile Application สำหรับดูสถานะทรัพยากร',
    hint: 'สามทางเข้าถึง AWS: Console (คลิก), CLI (พิมพ์คำสั่ง), SDK (เขียนโค้ด)',
    examTips: 'ข้อสอบมักถามว่าวิธีเข้าถึง AWS มีอะไรบ้าง — Console, CLI, SDK และ Infrastructure as Code',
  },
  {
    id: 'service-catalog',
    name: 'Service Catalog',
    fullName: 'AWS Service Catalog',
    category: 'Management',
    description: 'แคตตาล็อกทรัพยากรที่องค์กรอนุมัติแล้วให้พนักงานกดสร้างเองได้',
    answer:
      'บริการที่ให้ทีม IT สร้างและจัดการแคตตาล็อกของ product (CloudFormation template) ที่ผ่านการอนุมัติ ผู้ใช้ปลายทาง launch เองได้ภายใต้ข้อกำหนดด้าน governance และ compliance ขององค์กร',
    hint: 'เหมือนเมนูร้านอาหาร: พนักงานสั่งได้เฉพาะของที่อยู่ในเมนูที่ IT อนุมัติไว้',
    examTips: 'คำใบ้คือ "approved IT services" หรือ "self-service provisioning ที่คุม standard" — คำตอบคือ Service Catalog',
  },
  {
    id: 'service-quotas',
    name: 'Service Quotas',
    fullName: 'Service Quotas',
    category: 'Management',
    description: 'ดูและขอเพิ่มเพดานการใช้งาน (limit) ของแต่ละบริการ',
    answer:
      'บริการแสดงค่า quota (เดิมเรียก service limits) ของบริการ AWS ในแต่ละ region เช่น จำนวน EC2 vCPU หรือ VPC ต่อ region ขอเพิ่ม quota ได้จากหน้าเดียว และตั้ง CloudWatch alarm เมื่อใกล้ถึงเพดาน',
    hint: 'สร้าง EC2 เพิ่มไม่ได้เพราะชนเพดาน ให้ไปขอเพิ่มที่ Service Quotas',
    examTips: 'คำใบ้คือ "service limits" หรือ "request a quota increase" — Trusted Advisor ก็ช่วยเตือนเรื่อง service limits ได้',
  },
  {
    id: 'well-architected-tool',
    name: 'Well-Architected Tool',
    fullName: 'AWS Well-Architected Tool',
    category: 'Management',
    description: 'ตอบชุดคำถามเพื่อรีวิว workload เทียบกับ Well-Architected Framework',
    answer:
      'เครื่องมือฟรีใน Console ที่ให้ตอบคำถามตาม 6 pillar ของ Well-Architected Framework แล้วสรุปความเสี่ยง (high/medium risk) พร้อมแผนปรับปรุงและติดตามผลเป็น milestone',
    hint: 'Framework คือหลักการ ส่วน Tool คือแบบฟอร์มที่ใช้ตรวจ workload จริงตามหลักการนั้น',
    examTips: 'คำใบ้คือ "review workloads against best practices" — คำตอบคือ Well-Architected Tool ไม่ใช่ Trusted Advisor',
  },

  // -------------------------------------------------------- Developer Tools (6)
  {
    id: 'aws-cli',
    name: 'AWS CLI',
    fullName: 'AWS Command Line Interface',
    category: 'Developer Tools',
    description: 'สั่งงานบริการ AWS ด้วยคำสั่งใน terminal และเขียนเป็น script ได้',
    answer:
      'เครื่องมือ command line ที่ควบคุมบริการ AWS ได้เกือบทั้งหมดผ่านคำสั่ง เช่น aws s3 cp ใช้ access key หรือ IAM Identity Center ในการยืนยันตัวตน และนำไปเขียน script เพื่อทำงานอัตโนมัติได้',
    hint: 'งานที่ต้องทำซ้ำทุกวันผ่านการคลิก Console ให้เปลี่ยนมาเขียน script ด้วย CLI',
    examTips: 'CLI และ SDK เรียก API ตัวเดียวกับ Console — โจทย์ "automate ด้วย script" ให้ตอบ CLI',
  },
  {
    id: 'codebuild',
    name: 'CodeBuild',
    fullName: 'AWS CodeBuild',
    category: 'Developer Tools',
    description: 'คอมไพล์โค้ด รันเทสต์ และสร้าง package โดยไม่ต้องมี build server',
    answer:
      'fully managed continuous integration (CI) service ที่ compile source code, รัน test และสร้าง artifact พร้อม deploy สเกลอัตโนมัติและจ่ายเฉพาะนาทีที่ build',
    hint: 'CodeBuild = ขั้น "build + test" ภายใน pipeline ที่ CodePipeline เป็นคนคุม',
    examTips: 'คำใบ้คือ "compile", "run tests", "no build servers to manage" — คำตอบคือ CodeBuild',
  },
  {
    id: 'codepipeline',
    name: 'CodePipeline',
    fullName: 'AWS CodePipeline',
    category: 'Developer Tools',
    description: 'สายพาน CI/CD อัตโนมัติจาก commit จนถึง production',
    answer:
      'fully managed continuous delivery service ที่ตรวจจับการเปลี่ยนแปลงใน repository แล้วรันขั้น source, build, test และ deploy ต่อกันอัตโนมัติทุกครั้งที่มี commit',
    hint: 'CodePipeline คือ "ผู้ควบคุมวง" ที่เรียก CodeBuild และเครื่องมือ deploy ตามลำดับ',
    examTips: 'คำใบ้คือ "CI/CD", "automate release pipeline" — คำตอบคือ CodePipeline',
  },
  {
    id: 'x-ray',
    name: 'X-Ray',
    fullName: 'AWS X-Ray',
    category: 'Developer Tools',
    description: 'ติดตาม request ข้ามหลายบริการเพื่อหาจุดที่ช้าหรือพัง',
    answer:
      'บริการ distributed tracing ที่ติดตาม request ขณะวิ่งผ่าน microservice, Lambda และฐานข้อมูล แสดงเป็น service map ให้เห็นคอขวดด้าน performance และจุดที่เกิด error',
    hint: 'X-Ray เหมือนเอ็กซเรย์แอป มองทะลุเข้าไปเห็นว่า request ติดอยู่ตรงไหน',
    examTips: 'คำใบ้คือ "trace", "debug", "performance bottleneck" ของแอป — X-Ray ไม่ใช่ CloudWatch (metric/log) และไม่ใช่ CloudTrail (API audit)',
  },
  {
    id: 'appsync',
    name: 'AppSync',
    fullName: 'AWS AppSync',
    category: 'Developer Tools',
    description: 'สร้าง GraphQL API ที่รวมข้อมูลจากหลายแหล่งไว้ใน API เดียว',
    answer:
      'fully managed GraphQL (และ Pub/Sub) API service ที่เชื่อม frontend กับ backend data หลายแหล่ง เช่น DynamoDB, Lambda และ HTTP API ให้ client ขอเฉพาะข้อมูลที่ต้องการ และรองรับ real-time subscription',
    hint: 'จำคู่คำ: GraphQL = AppSync, REST/HTTP/WebSocket API = API Gateway',
    examTips: 'คำใบ้คือ "GraphQL" — คำตอบคือ AppSync',
  },
  {
    id: 'amplify',
    name: 'Amplify',
    fullName: 'AWS Amplify',
    category: 'Developer Tools',
    description: 'ชุดเครื่องมือสร้างและโฮสต์เว็บ/แอปมือถือแบบ full-stack ได้เร็ว',
    answer:
      'บริการสำหรับนักพัฒนา frontend ที่เพิ่ม authentication, API, storage และ hosting ให้แอปเว็บและมือถือได้ในไม่กี่คำสั่ง พร้อม CI/CD ที่ deploy อัตโนมัติจาก Git และไม่ต้องดูแล infrastructure เอง',
    hint: 'นักพัฒนา React/Next.js อยากได้ backend + hosting ครบชุดโดยไม่ต้องรู้ AWS ลึก ให้ใช้ Amplify',
    examTips: 'คำใบ้คือ "full-stack web and mobile app", "frontend developers" — คำตอบคือ Amplify',
  },

  // ---------------------------------------------------------- Business Apps (2)
  {
    id: 'connect',
    name: 'Connect',
    fullName: 'Amazon Connect',
    category: 'Business Apps',
    description: 'contact center บนคลาวด์ที่มี AI รับสาย แชต และวิเคราะห์บทสนทนา',
    answer:
      'AI-powered cloud contact center ที่ตั้ง call center ได้ในไม่กี่นาที มี call routing, call recording, real-time analytics และผสานกับ Lex (แชตบอต), Transcribe และ Contact Lens จ่ายตามการใช้งาน ไม่มีค่าใช้จ่ายขั้นต่ำ',
    hint: 'คำใบ้คือ "call center", "customer service", "call routing / recording"',
    examTips: 'โจทย์ที่ต้องการ contact center พร้อม routing, recording และ analytics ให้ตอบ Connect',
  },
  {
    id: 'ses',
    name: 'SES',
    fullName: 'Amazon Simple Email Service',
    category: 'Business Apps',
    description: 'ส่งอีเมลปริมาณมาก ทั้ง transactional และ marketing ด้วยต้นทุนต่ำ',
    answer:
      'บริการส่งอีเมลแบบสเกลได้ผ่าน API หรือ SMTP ใช้ส่งอีเมลยืนยันคำสั่งซื้อ รีเซ็ตรหัสผ่าน จดหมายข่าว และโปรโมชัน พร้อมติดตาม deliverability, bounce และ complaint',
    hint: 'SNS ส่งการแจ้งเตือนสั้น ๆ ได้หลายช่องทาง แต่ถ้าเป็นอีเมลจำนวนมากที่ออกแบบเนื้อหาเอง ให้ใช้ SES',
    examTips: 'คำใบ้คือ "high-volume email", "marketing / transactional email" — คำตอบคือ SES',
  },

  // ----------------------------------------------------- End-User Computing (3)
  {
    id: 'appstream',
    name: 'AppStream 2.0',
    fullName: 'Amazon AppStream 2.0 (ปัจจุบันชื่อ Amazon WorkSpaces Applications)',
    category: 'End-User Computing',
    description: 'สตรีมแอปพลิเคชันจากคลาวด์ไปยังเบราว์เซอร์บนอุปกรณ์ใดก็ได้',
    answer:
      'fully managed application streaming ที่รันแอป desktop บนคลาวด์แล้วสตรีมภาพไปให้ผู้ใช้ผ่านเบราว์เซอร์ ส่งมอบแอปเป็นแบบ SaaS ได้โดยไม่ต้องแก้โค้ด และไม่ต้องใช้เครื่องสเปกสูงฝั่งผู้ใช้',
    hint: 'สตรีม "แอป" รายตัว (เช่น โปรแกรม CAD) ไม่ใช่ทั้ง desktop แบบ WorkSpaces',
    examTips: 'AWS เปลี่ยนชื่อเป็น WorkSpaces Applications เมื่อ พ.ย. 2025 แต่ exam guide ยังใช้ชื่อ AppStream 2.0 — โจทย์ "ให้พนักงานเข้าแอป SaaS / desktop app ผ่านเบราว์เซอร์" ให้ตอบตัวนี้',
  },
  {
    id: 'workspaces',
    name: 'WorkSpaces',
    fullName: 'Amazon WorkSpaces',
    category: 'End-User Computing',
    description: 'เครื่อง desktop เสมือน (VDI) บนคลาวด์ ใช้ได้จากทุกที่',
    answer:
      'fully managed virtual desktop infrastructure (DaaS) ที่ให้พนักงานแต่ละคนมี Windows หรือ Linux desktop บนคลาวด์ เข้าใช้ได้จากอุปกรณ์ใดก็ได้ที่ต่ออินเทอร์เน็ต จ่ายรายเดือนหรือรายชั่วโมง',
    hint: 'พนักงาน work from home ได้ "คอมพิวเตอร์ที่ทำงาน" ทั้งเครื่อง โดยข้อมูลไม่ลงเครื่องส่วนตัว',
    examTips: 'คำใบ้คือ "virtual desktop", "VDI", "desktop as a service" — คำตอบคือ WorkSpaces',
  },
  {
    id: 'workspaces-secure-browser',
    name: 'WorkSpaces Secure Browser',
    fullName: 'Amazon WorkSpaces Secure Browser (เดิม WorkSpaces Web)',
    category: 'End-User Computing',
    description: 'เบราว์เซอร์องค์กรบนคลาวด์สำหรับเข้าเว็บภายในและแอป SaaS อย่างปลอดภัย',
    answer:
      'fully managed remote enterprise browser ที่ให้พนักงานเข้าเว็บไซต์ภายใน แอป SaaS และอินเทอร์เน็ตผ่านสภาพแวดล้อมที่ปลอดภัย ไม่ต้องติดตั้ง client พิเศษ ไม่ต้องดูแล infrastructure หรือ VPN',
    hint: 'พนักงานต้องการแค่ "เว็บ" ไม่ต้องการทั้ง desktop — ตัวเลือกที่เบากว่า WorkSpaces',
    examTips: 'เรียงจากหนักไปเบา: WorkSpaces (ทั้ง desktop) → AppStream 2.0 (แอปรายตัว) → Secure Browser (เว็บอย่างเดียว)',
  },

  // -------------------------------------------------------------------- IoT (1)
  {
    id: 'iot-core',
    name: 'IoT Core',
    fullName: 'AWS IoT Core',
    category: 'IoT',
    description: 'เชื่อมอุปกรณ์ IoT นับพันล้านเครื่องเข้าคลาวด์อย่างปลอดภัย',
    answer:
      'managed cloud service ที่ให้อุปกรณ์ IoT ส่งและรับข้อความกับแอปบนคลาวด์ผ่าน MQTT, HTTPS หรือ WebSocket ยืนยันตัวตนแบบ mutual authentication เข้ารหัส end-to-end และใช้ rules engine ส่งข้อมูลต่อไปยัง Lambda, S3 หรือ DynamoDB',
    hint: 'กล้องวงจรปิดอัจฉริยะ ที่ให้อาหารสัตว์ควบคุมผ่านมือถือ หรือปลั๊ก Wi-Fi สั่งปิดไฟจากระยะไกล',
    examTips: 'คำใบ้คือ "connected devices", "sensors", "IoT" — คำตอบคือ IoT Core',
  },

  // ------------------------------------------------------------------ AI/ML (12)
  {
    id: 'sagemaker',
    name: 'SageMaker',
    fullName: 'Amazon SageMaker',
    category: 'AI/ML',
    description: 'แพลตฟอร์มครบวงจรสำหรับสร้าง เทรน และ deploy โมเดล machine learning',
    answer:
      'บริการ ML แบบ end-to-end ที่รวมการเตรียมข้อมูล, notebook, การเทรน, การจูน hyperparameter และการ deploy เป็น endpoint ไว้ในที่เดียว',
    hint: 'โจทย์ที่บอกว่าต้อง "สร้างโมเดลของตัวเอง" ให้ตอบ SageMaker ไม่ใช่บริการ AI สำเร็จรูป',
    examTips: 'แยกให้ชัด: SageMaker = สร้างโมเดลเอง, บริการอย่าง Rekognition/Comprehend = โมเดลสำเร็จรูปเรียกใช้ผ่าน API',
  },
  {
    id: 'bedrock',
    name: 'Bedrock',
    fullName: 'Amazon Bedrock',
    category: 'AI/ML',
    description: 'เรียกใช้ foundation model สำหรับงาน generative AI ผ่าน API เดียว',
    answer:
      'บริการ serverless ที่ให้เข้าถึง foundation model จากหลายผู้ผลิต (Anthropic, Meta, Mistral, Amazon Titan) ผ่าน API เดียว ปรับแต่งด้วยข้อมูลของเราได้โดยข้อมูลไม่ถูกนำไปเทรนโมเดลสาธารณะ',
    hint: 'คำใบ้คือ "generative AI", "foundation model" หรือ "สร้างแชตบอตที่เข้าใจภาษาธรรมชาติ"',
    examTips: 'Bedrock เป็น serverless ไม่ต้องจัดการ infrastructure ต่างจาก SageMaker ที่ต้องเลือกเครื่องเทรน',
  },
  {
    id: 'rekognition',
    name: 'Rekognition',
    fullName: 'Amazon Rekognition',
    category: 'AI/ML',
    description: 'วิเคราะห์ภาพและวิดีโอ ตรวจจับวัตถุ ใบหน้า และเนื้อหาไม่เหมาะสม',
    answer:
      'บริการ computer vision ที่ตรวจจับวัตถุ ฉาก ใบหน้า ข้อความในภาพ และคัดกรองเนื้อหาไม่เหมาะสม (content moderation) ทั้งในภาพนิ่งและวิดีโอ',
    hint: 'จำคู่คำ: รูปภาพและวิดีโอ = Rekognition',
    examTips: 'โจทย์ที่ต้องการคัดกรองภาพที่ผู้ใช้อัปโหลดโดยอัตโนมัติ ให้ตอบ Rekognition',
  },
  {
    id: 'comprehend',
    name: 'Comprehend',
    fullName: 'Amazon Comprehend',
    category: 'AI/ML',
    description: 'วิเคราะห์ข้อความหาความรู้สึก ประเด็นสำคัญ และหน่วยงานที่ถูกกล่าวถึง',
    answer:
      'บริการ natural language processing ที่หา sentiment, key phrase, entity, ภาษา และจัดกลุ่มหัวข้อจากข้อความ มี Comprehend Medical สำหรับข้อความทางการแพทย์',
    hint: 'คำใบ้คือ "sentiment analysis" หรือ "วิเคราะห์รีวิวลูกค้าว่าบวกหรือลบ"',
    examTips: 'จำคู่คำ: ข้อความ (text analytics) = Comprehend',
  },
  {
    id: 'polly',
    name: 'Polly',
    fullName: 'Amazon Polly',
    category: 'AI/ML',
    description: 'แปลงข้อความให้เป็นเสียงพูดที่ฟังเป็นธรรมชาติ',
    answer:
      'บริการ text-to-speech ที่สร้างไฟล์เสียงจากข้อความ มีเสียง neural (NTTS) ที่ฟังเป็นธรรมชาติ และรองรับหลายภาษาและหลายเสียง',
    hint: 'จำทิศทาง: Polly = ข้อความไปเป็นเสียง (text → speech)',
    examTips: 'ข้อสอบชอบให้จำคู่ตรงข้าม: Polly = text→speech, Transcribe = speech→text',
  },
  {
    id: 'transcribe',
    name: 'Transcribe',
    fullName: 'Amazon Transcribe',
    category: 'AI/ML',
    description: 'ถอดเสียงพูดเป็นข้อความ รองรับการแยกผู้พูดและคำบรรยายอัตโนมัติ',
    answer:
      'บริการ automatic speech recognition ที่แปลงไฟล์เสียงหรือสตรีมเป็นข้อความ รองรับ speaker diarization, custom vocabulary และการปิดบังข้อมูลอ่อนไหว',
    hint: 'ทำ subtitle ให้วิดีโอ หรือถอดบทสนทนา call center',
    examTips: 'จำทิศทาง: Transcribe = เสียงไปเป็นข้อความ (speech → text)',
  },
  {
    id: 'translate',
    name: 'Translate',
    fullName: 'Amazon Translate',
    category: 'AI/ML',
    description: 'แปลข้อความระหว่างภาษาด้วย neural machine translation',
    answer:
      'บริการแปลภาษาอัตโนมัติที่ใช้ neural machine translation รองรับหลายสิบภาษา แปลแบบ real-time หรือแบบ batch และปรับคำศัพท์เฉพาะทางได้ด้วย custom terminology',
    hint: 'มักใช้ต่อกันเป็นสายงาน: Transcribe → Translate → Polly เพื่อทำเสียงพากย์ข้ามภาษา',
    examTips: 'จำคู่คำ: แปลภาษา = Translate',
  },
  {
    id: 'lex',
    name: 'Lex',
    fullName: 'Amazon Lex',
    category: 'AI/ML',
    description: 'สร้างแชตบอตและระบบสนทนาด้วยเสียงหรือข้อความ',
    answer:
      'บริการสร้าง conversational interface ที่เข้าใจ intent และเก็บ slot จากบทสนทนา ใช้เอนจินเดียวกับ Alexa และเชื่อมกับ Lambda เพื่อทำงานจริงเบื้องหลัง',
    hint: 'คำใบ้คือ "chatbot", "virtual agent" หรือ "ระบบตอบรับอัตโนมัติ"',
    examTips: 'จำคู่คำ: chatbot = Lex (และมักคู่กับ Connect สำหรับ call center)',
  },
  {
    id: 'kendra',
    name: 'Kendra',
    fullName: 'Amazon Kendra',
    category: 'AI/ML',
    description: 'ระบบค้นหาภายในองค์กรที่ตอบคำถามเป็นภาษาธรรมชาติ',
    answer:
      'intelligent enterprise search ที่เชื่อมกับแหล่งข้อมูลหลายที่ (S3, SharePoint, Salesforce) และตอบคำถามเป็นภาษาธรรมชาติพร้อมอ้างอิงเอกสารต้นทาง',
    hint: 'คำใบ้คือ "enterprise search" หรือ "พนักงานค้นหาเอกสารภายในบริษัทแล้วได้คำตอบ ไม่ใช่แค่ลิงก์"',
    examTips: 'Kendra = ค้นหาเอกสาร, Lex = สนทนาโต้ตอบ — โจทย์อาจให้เลือกระหว่างสองตัวนี้',
  },
  {
    id: 'textract',
    name: 'Textract',
    fullName: 'Amazon Textract',
    category: 'AI/ML',
    description: 'ดึงข้อความ ตาราง และฟอร์มออกจากเอกสารสแกนและ PDF',
    answer:
      'บริการ document analysis ที่ทำได้มากกว่า OCR ทั่วไป เพราะเข้าใจโครงสร้างตารางและคู่ key-value ในแบบฟอร์ม เหมาะกับใบแจ้งหนี้และใบสมัคร',
    hint: 'ต่างจาก Rekognition ที่อ่านข้อความสั้น ๆ ในภาพ — Textract เข้าใจโครงสร้างเอกสารทั้งฉบับ',
    examTips: 'คำใบ้คือ "extract data from scanned documents/forms" — คำตอบคือ Textract',
  },
  {
    id: 'personalize',
    name: 'Personalize',
    fullName: 'Amazon Personalize',
    category: 'AI/ML',
    description: 'สร้างระบบแนะนำสินค้าและเนื้อหาเฉพาะบุคคลแบบเรียลไทม์',
    answer:
      'บริการ recommendation engine ที่ใช้เทคโนโลยีเดียวกับ Amazon.com สร้างคำแนะนำเฉพาะบุคคลจากพฤติกรรมผู้ใช้โดยไม่ต้องมีทีม ML',
    hint: 'คำใบ้คือ "personalized recommendation" หรือ "สินค้าที่คุณอาจสนใจ"',
    examTips: 'จำคู่คำ: ระบบแนะนำ = Personalize (ไม่ต้องไปสร้างโมเดลเองบน SageMaker)',
  },
  {
    id: 'amazon-q',
    name: 'Amazon Q',
    fullName: 'Amazon Q',
    category: 'AI/ML',
    description: 'ผู้ช่วย generative AI สำหรับงานพัฒนาซอฟต์แวร์และงานในองค์กร',
    answer:
      'generative AI assistant มีสองกลุ่มหลัก: Amazon Q Developer (ช่วยเขียนโค้ด อธิบายโค้ด แก้ปัญหาบน AWS ใน IDE และ Console) และ Amazon Q Business (ตอบคำถามจากข้อมูลและเอกสารภายในองค์กร โดยเคารพสิทธิ์การเข้าถึงเดิม)',
    hint: 'Bedrock = แพลตฟอร์มให้นักพัฒนาสร้างแอป gen AI เอง, Q = ผู้ช่วยสำเร็จรูปพร้อมใช้',
    examTips: 'คำใบ้คือ "AI-powered assistant", "code suggestions" หรือ "ถามตอบจากข้อมูลบริษัท" — คำตอบคือ Amazon Q',
  },

  // -------------------------------------------------------------- Migration (6)
  {
    id: 'dms',
    name: 'DMS',
    fullName: 'Database Migration Service',
    category: 'Migration',
    description: 'ย้ายฐานข้อมูลเข้า AWS โดยระบบต้นทางยังเปิดใช้งานได้ต่อเนื่อง',
    answer:
      'บริการย้ายฐานข้อมูลที่รองรับทั้งแบบ homogeneous (Oracle ไป Oracle) และ heterogeneous (Oracle ไป Aurora ด้วย Schema Conversion Tool) โดยต้นทางยังทำงานได้ระหว่างย้าย',
    hint: 'คำใบ้คือ "minimal downtime database migration"',
    examTips: 'การย้ายข้ามชนิดฐานข้อมูลต้องใช้ AWS SCT (Schema Conversion Tool) ร่วมกับ DMS',
  },
  {
    id: 'migration-hub',
    name: 'Migration Hub',
    fullName: 'AWS Migration Hub',
    category: 'Migration',
    description: 'หน้าจอกลางติดตามความคืบหน้าการย้ายระบบจากทุกเครื่องมือ',
    answer:
      'ศูนย์รวมติดตามสถานะการ migrate จากเครื่องมือต่าง ๆ เช่น DMS และ MGN ในที่เดียว พร้อมค้นหาและจัดกลุ่มแอปที่ยังอยู่ on-premises',
    hint: 'คำใบ้คือ "single location to track migration progress"',
    examTips: 'Migration Hub ไม่ย้ายอะไรเอง แต่รวบรวมสถานะจากเครื่องมือย้ายอื่น',
  },
  {
    id: 'mgn',
    name: 'MGN',
    fullName: 'AWS Application Migration Service',
    category: 'Migration',
    description: 'ยกเซิร์ฟเวอร์ทั้งเครื่องขึ้น AWS แบบ lift-and-shift อัตโนมัติ',
    answer:
      'บริการ lift-and-shift ที่ทำ replication ระดับ block จากเซิร์ฟเวอร์ต้นทางขึ้น AWS แล้วแปลงเป็น EC2 instance ให้อัตโนมัติ ลด downtime ในการตัดระบบ',
    hint: 'เป็นบริการที่ AWS แนะนำแทน Server Migration Service (SMS) ที่เลิกใช้แล้ว',
    examTips: 'โจทย์ "rehost แอปเดิมขึ้นคลาวด์โดยไม่แก้โค้ด" ให้ตอบ Application Migration Service',
  },
  {
    id: 'application-discovery',
    name: 'Application Discovery Service',
    fullName: 'AWS Application Discovery Service',
    category: 'Migration',
    description: 'สำรวจเซิร์ฟเวอร์ใน data center ก่อนย้าย ว่ามีอะไรและพึ่งพากันอย่างไร',
    answer:
      'บริการเก็บข้อมูลเซิร์ฟเวอร์ on-premises ทั้งสเปก การใช้งาน และการเชื่อมต่อระหว่างเครื่อง (dependency) ผ่าน agent หรือ agentless collector แล้วส่งผลเข้า Migration Hub เพื่อวางแผนการย้าย',
    hint: 'ขั้นแรกของการย้ายคือ "รู้ก่อนว่าบ้านเรามีอะไร" — Discovery Service ทำหน้าที่นั้น',
    examTips: 'คำใบ้คือ "discover on-premises servers" หรือ "map dependencies" ก่อน migrate',
  },
  {
    id: 'migration-evaluator',
    name: 'Migration Evaluator',
    fullName: 'Migration Evaluator',
    category: 'Migration',
    description: 'ทำ business case ประเมินต้นทุนและความคุ้มค่าก่อนย้ายขึ้น AWS',
    answer:
      'บริการประเมินการย้ายระบบที่วิเคราะห์ข้อมูลการใช้งานจริงของ on-premises แล้วจำลองค่าใช้จ่ายบน AWS แบบ right-sized รวมถึงทางเลือกด้าน license เพื่อสร้าง business case ให้ผู้บริหารตัดสินใจ',
    hint: 'ชื่อเดิมคือ TSO Logic — ใช้ตอบคำถาม "ย้ายแล้วประหยัดเท่าไร"',
    examTips: 'คำใบ้คือ "build a business case" หรือ "TCO ก่อน migrate" — คำตอบคือ Migration Evaluator',
  },
  {
    id: 'sct',
    name: 'SCT',
    fullName: 'AWS Schema Conversion Tool',
    category: 'Migration',
    description: 'แปลง schema และโค้ดฐานข้อมูลเมื่อย้ายข้ามชนิด database engine',
    answer:
      'เครื่องมือแปลง database schema, stored procedure และโค้ด SQL จาก engine หนึ่งไปอีก engine หนึ่ง เช่น Oracle ไป Aurora PostgreSQL หรือ SQL Server ไป MySQL แล้วใช้ DMS ย้ายข้อมูลจริง',
    hint: 'SCT แปลง "โครงสร้าง", DMS ย้าย "ข้อมูล"',
    examTips: 'การย้ายแบบ heterogeneous (ต่าง engine) ต้องใช้ SCT + DMS ส่วนแบบ homogeneous ใช้ DMS อย่างเดียวได้',
  },

  // ---------------------------------------------------------------- Billing (11)
  {
    id: 'free-tier',
    name: 'Free Tier',
    fullName: 'AWS Free Tier',
    category: 'Billing',
    description: 'โควตาใช้ฟรีสำหรับผู้เริ่มต้น มีทั้งแบบหมดอายุและแบบใช้ฟรีตลอด',
    answer:
      'สิทธิ์ใช้งานฟรี 3 รูปแบบ: 12-month free tier (เช่น EC2 t2.micro 750 ชั่วโมงต่อเดือน), always free (เช่น Lambda 1 ล้าน request ต่อเดือน) และ short-term trial',
    hint: 'ระวังว่าเมื่อเกินโควตาระบบจะคิดเงินต่อทันที ควรตั้ง Budget แจ้งเตือนไว้',
    examTips: 'ข้อสอบชอบถามว่า Free Tier แบ่งเป็นกี่ประเภท — ตอบ 3 ประเภทตามด้านบน',
  },
  {
    id: 'pricing-calculator',
    name: 'Pricing Calculator',
    fullName: 'AWS Pricing Calculator',
    category: 'Billing',
    description: 'ประมาณค่าใช้จ่ายล่วงหน้าก่อนสร้างทรัพยากรจริง',
    answer:
      'เครื่องมือประเมินค่าใช้จ่ายรายเดือนจากการกรอกสเปกที่วางแผนไว้ สร้างใบเสนอราคาแบ่งตามกลุ่มบริการและแชร์ลิงก์ประมาณการให้ผู้อื่นได้',
    hint: 'จำทิศเวลา: Pricing Calculator = ประเมินอนาคต, Cost Explorer = วิเคราะห์อดีต',
    examTips: 'โจทย์ที่บอกว่า "ยังไม่ได้ย้ายขึ้นคลาวด์แต่ต้องการประมาณค่าใช้จ่าย" ให้ตอบ Pricing Calculator',
  },
  {
    id: 'cost-explorer',
    name: 'Cost Explorer',
    fullName: 'AWS Cost Explorer',
    category: 'Billing',
    description: 'ดูและวิเคราะห์ค่าใช้จ่ายย้อนหลังพร้อมพยากรณ์แนวโน้ม',
    answer:
      'เครื่องมือแสดงกราฟค่าใช้จ่ายย้อนหลังได้ถึง 12 เดือน แยกตามบริการ, tag, บัญชี และภูมิภาค พร้อมพยากรณ์ค่าใช้จ่ายล่วงหน้าและแนะนำ Reserved Instance หรือ Savings Plans',
    hint: 'คำใบ้คือ "visualize" หรือ "วิเคราะห์ว่าเดือนที่แล้วเงินหมดไปกับบริการอะไร"',
    examTips: 'Cost Explorer วิเคราะห์และพยากรณ์ ส่วน Budgets ทำหน้าที่แจ้งเตือนเมื่อเกินเพดาน',
  },
  {
    id: 'budgets',
    name: 'Budgets',
    fullName: 'AWS Budgets',
    category: 'Billing',
    description: 'ตั้งเพดานค่าใช้จ่ายและแจ้งเตือนเมื่อใช้จ่ายใกล้หรือเกินงบ',
    answer:
      'บริการตั้งงบประมาณด้าน cost, usage, Reserved Instance หรือ Savings Plans แล้วส่งการแจ้งเตือนผ่าน SNS หรืออีเมลเมื่อค่าจริงหรือค่าพยากรณ์เกินเกณฑ์',
    hint: 'คำใบ้ที่ชัดที่สุดคือคำว่า "alert" หรือ "แจ้งเตือน" เรื่องค่าใช้จ่าย',
    examTips: 'จำคู่กัน: Budgets = แจ้งเตือนล่วงหน้า, Cost Explorer = ดูย้อนหลัง, Pricing Calculator = ประเมินก่อนใช้',
  },
  {
    id: 'consolidated-billing',
    name: 'Consolidated Billing',
    fullName: 'Consolidated Billing',
    category: 'Billing',
    description: 'รวมบิลของทุกบัญชีในองค์กรเป็นใบเดียวและได้ส่วนลดตามปริมาณ',
    answer:
      'ฟีเจอร์ของ AWS Organizations ที่รวมค่าใช้จ่ายทุกบัญชีมาชำระที่ management account ใบเดียว และรวมปริมาณการใช้เพื่อให้ได้ volume discount และแชร์สิทธิ์ Reserved Instance',
    hint: 'ประโยชน์หลักสองข้อคือ บิลใบเดียวและส่วนลดจากการรวมปริมาณ',
    examTips: 'ข้อสอบมักถามข้อดีของหลายบัญชี — ตอบ single bill, volume pricing discount และการแชร์ RI/Savings Plans',
  },
  {
    id: 'savings-plans',
    name: 'Savings Plans',
    fullName: 'AWS Savings Plans',
    category: 'Billing',
    description: 'คอมมิตค่าใช้จ่ายต่อชั่วโมง 1-3 ปี เพื่อลดราคาแบบยืดหยุ่น',
    answer:
      'โมเดลราคาที่คอมมิตยอดใช้จ่ายเป็นดอลลาร์ต่อชั่วโมงเป็นเวลา 1 หรือ 3 ปี ลดราคาได้ถึง 72% ครอบคลุม EC2, Fargate และ Lambda โดยเปลี่ยน instance family หรือ region ได้',
    hint: 'ยืดหยุ่นกว่า Reserved Instances เพราะคอมมิตเป็นจำนวนเงิน ไม่ใช่สเปกเครื่องเฉพาะ',
    examTips: 'Compute Savings Plans ยืดหยุ่นสุด (ครอบ Lambda และ Fargate ด้วย), EC2 Instance Savings Plans ลดได้มากกว่าแต่ผูก instance family',
  },
  {
    id: 'reserved-instances',
    name: 'Reserved Instances',
    fullName: 'Amazon EC2 Reserved Instances',
    category: 'Billing',
    description: 'จองเครื่องล่วงหน้า 1-3 ปี เพื่อได้ราคาถูกกว่า On-Demand มาก',
    answer:
      'การคอมมิตใช้ instance สเปกที่กำหนดเป็นเวลา 1 หรือ 3 ปี ลดราคาได้ถึง 72% เลือกจ่ายแบบ No Upfront, Partial Upfront หรือ All Upfront (ถูกที่สุด) และมีทั้ง Standard และ Convertible',
    hint: 'เหมาะกับ workload ที่รันตลอดเวลาและคาดการณ์ได้ เช่น ฐานข้อมูลของระบบหลัก',
    examTips: 'จ่าย All Upfront ได้ส่วนลดมากที่สุด และ Convertible RI แลกเปลี่ยนสเปกได้แต่ส่วนลดน้อยกว่า Standard',
  },
  {
    id: 'spot-instances',
    name: 'Spot Instances',
    fullName: 'Amazon EC2 Spot Instances',
    category: 'Billing',
    description: 'ใช้กำลังประมวลผลเหลือของ AWS ราคาถูกสุดแต่ถูกเรียกคืนได้',
    answer:
      'การซื้อ capacity ที่ว่างอยู่ในราคาลดสูงสุดถึง 90% แต่ AWS สามารถเรียกคืนเครื่องได้โดยแจ้งล่วงหน้า 2 นาที จึงเหมาะกับงานที่ขาดตอนได้',
    hint: 'ใช้กับงานที่หยุดกลางทางแล้วเริ่มใหม่ได้ เช่น batch processing หรือ CI/CD worker',
    examTips: 'อย่าเลือก Spot สำหรับฐานข้อมูลหรือ workload ที่ต้องรันต่อเนื่อง — ข้อสอบมักวางกับดักข้อนี้',
  },
  {
    id: 'support-plans',
    name: 'Support Plans',
    fullName: 'AWS Support Plans',
    category: 'Billing',
    description: 'แผนบริการสนับสนุน 5 ระดับที่ต่างกันที่เวลาตอบและสิทธิ์ที่ได้',
    answer:
      'มี 5 ระดับ: Basic (ฟรี เปิดเคสทางเทคนิคไม่ได้), Developer (ตอบทางอีเมลในเวลาทำการ), Business (ตอบ 24/7 ทางโทรศัพท์และแชต ได้ Trusted Advisor ครบทุก check), Enterprise On-Ramp (เข้าถึง TAM แบบทีมกลาง ตอบเคสวิกฤตใน 30 นาที) และ Enterprise (มี TAM ประจำ ตอบเคสวิกฤตใน 15 นาที)',
    hint: 'จำเวลาตอบ: production ล่ม = 1 ชั่วโมง (Business ขึ้นไป), ระบบวิกฤตล่ม = 30 นาที (On-Ramp) และ 15 นาที (Enterprise)',
    examTips:
      'Technical Account Manager (TAM) มีเฉพาะ Enterprise (และ Enterprise On-Ramp) — เป็นคำถามที่ออกสอบบ่อยมาก',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    fullName: 'AWS Marketplace',
    category: 'Billing',
    description: 'ร้านค้าซอฟต์แวร์จากผู้ขายภายนอกที่คิดเงินรวมในบิล AWS',
    answer:
      'ตลาดกลางดิจิทัลที่เลือกซื้อซอฟต์แวร์และ AMI จาก third-party vendor ติดตั้งได้ทันทีและค่าใช้จ่ายรวมมาในบิล AWS เดียวกัน',
    hint: 'คำใบ้คือ "third-party software" หรือ "ซื้อ appliance จากผู้ขายรายอื่นแล้วจ่ายผ่าน AWS"',
    examTips: 'โจทย์ที่ต้องการซอฟต์แวร์เชิงพาณิชย์ที่พร้อมใช้และรวมบิล ให้ตอบ AWS Marketplace',
  },
  {
    id: 'cost-usage-report',
    name: 'Cost and Usage Report',
    fullName: 'AWS Cost and Usage Report (CUR)',
    category: 'Billing',
    description: 'รายงานค่าใช้จ่ายละเอียดที่สุดระดับรายชั่วโมงส่งเข้า S3',
    answer:
      'รายงานบิลที่ละเอียดที่สุดของ AWS แจกแจงค่าใช้จ่ายและการใช้งานรายบริการ รายทรัพยากร และราย tag ระดับรายชั่วโมงหรือรายวัน ส่งเป็นไฟล์เข้า S3 เพื่อวิเคราะห์ต่อด้วย Athena, Redshift หรือ QuickSight',
    hint: 'Cost Explorer ดูกราฟสรุป แต่ถ้าต้องการข้อมูลดิบละเอียดทุกบรรทัดไปวิเคราะห์เอง ให้ใช้ CUR',
    examTips: 'คำใบ้คือ "most comprehensive / detailed billing data" — คำตอบคือ Cost and Usage Report',
  },
]

/** Fast lookup of every valid service id; used to sanitise stored progress. */
export const SERVICE_IDS: ReadonlySet<string> = new Set(awsServices.map((service) => service.id))

/** Lookup one service by id, for cross-linking from other datasets. */
export const serviceById: ReadonlyMap<string, AWSService> = new Map(
  awsServices.map((service) => [service.id, service]),
)

/** Total number of services in the dataset. */
export const TOTAL_SERVICES = awsServices.length

/** Number of services in each category, plus the "all" total. */
export const categoryCounts: Record<CategoryFilterValue, number> = (() => {
  const counts = { all: awsServices.length } as Record<CategoryFilterValue, number>
  for (const category of CATEGORIES) {
    counts[category] = 0
  }
  for (const service of awsServices) {
    counts[service.category] += 1
  }
  return counts
})()

/** Returns every service in a category, or the whole dataset for "all". */
export function servicesByCategory(category: CategoryFilterValue): AWSService[] {
  if (category === 'all') return [...awsServices]
  return awsServices.filter((service) => service.category === category)
}

/** Tailwind classes for each category badge, per the UI design guidelines. */
export const CATEGORY_STYLES: Record<Category, { badge: string; dot: string; ring: string }> = {
  Compute: { badge: 'bg-blue-500 text-white', dot: 'bg-blue-500', ring: 'ring-blue-500' },
  Storage: { badge: 'bg-green-500 text-white', dot: 'bg-green-500', ring: 'ring-green-500' },
  Database: { badge: 'bg-purple-500 text-white', dot: 'bg-purple-500', ring: 'ring-purple-500' },
  Analytics: { badge: 'bg-indigo-500 text-white', dot: 'bg-indigo-500', ring: 'ring-indigo-500' },
  Networking: { badge: 'bg-cyan-500 text-white', dot: 'bg-cyan-500', ring: 'ring-cyan-500' },
  Security: { badge: 'bg-red-500 text-white', dot: 'bg-red-500', ring: 'ring-red-500' },
  Serverless: { badge: 'bg-amber-500 text-white', dot: 'bg-amber-500', ring: 'ring-amber-500' },
  Management: { badge: 'bg-gray-600 text-white', dot: 'bg-gray-600', ring: 'ring-gray-600' },
  'Developer Tools': { badge: 'bg-sky-600 text-white', dot: 'bg-sky-600', ring: 'ring-sky-600' },
  'Business Apps': { badge: 'bg-rose-500 text-white', dot: 'bg-rose-500', ring: 'ring-rose-500' },
  'End-User Computing': { badge: 'bg-violet-500 text-white', dot: 'bg-violet-500', ring: 'ring-violet-500' },
  IoT: { badge: 'bg-lime-600 text-white', dot: 'bg-lime-600', ring: 'ring-lime-600' },
  'AI/ML': { badge: 'bg-pink-500 text-white', dot: 'bg-pink-500', ring: 'ring-pink-500' },
  Migration: { badge: 'bg-teal-500 text-white', dot: 'bg-teal-500', ring: 'ring-teal-500' },
  Billing: { badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-500', ring: 'ring-emerald-500' },
}

/** Thai labels shown on the category filter buttons. */
export const CATEGORY_LABELS_TH: Record<Category, string> = {
  Compute: 'ประมวลผล',
  Storage: 'จัดเก็บข้อมูล',
  Database: 'ฐานข้อมูล',
  Analytics: 'วิเคราะห์ข้อมูล',
  Networking: 'เครือข่าย',
  Security: 'ความปลอดภัย',
  Serverless: 'Serverless',
  Management: 'จัดการระบบ',
  'Developer Tools': 'เครื่องมือนักพัฒนา',
  'Business Apps': 'แอปธุรกิจ',
  'End-User Computing': 'เดสก์ท็อปเสมือน',
  IoT: 'IoT',
  'AI/ML': 'AI / ML',
  Migration: 'ย้ายระบบ',
  Billing: 'ค่าใช้จ่าย',
}
