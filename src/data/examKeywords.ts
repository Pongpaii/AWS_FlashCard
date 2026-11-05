/**
 * Exam trigger keywords per service, for the Match Game "จำไปสอบ" mode.
 *
 * Each list holds the phrases that CLF-C02 questions typically use when the
 * expected answer is that service. They deliberately avoid the service name
 * itself so the tile cannot be matched by spotting the same word.
 */
export const EXAM_KEYWORDS: Readonly<Record<string, readonly string[]>> = {
  // Compute
  ec2: ['Virtual server', 'Full OS control', 'Lift-and-shift'],
  lambda: ['Event-driven code', 'No servers', 'Max 15 minutes'],
  ecs: ['Docker containers', 'AWS-native orchestration', 'No Kubernetes'],
  eks: ['Managed Kubernetes', 'Open-source standard', 'Portable containers'],
  fargate: ['Serverless containers', 'No EC2 to manage', 'Runs under ECS/EKS'],
  'elastic-beanstalk': ['PaaS', 'Upload code only', 'Auto-provisioned infra'],
  lightsail: ['Simple VPS', 'Fixed monthly price', 'Beginner / small site'],
  'aws-batch': ['Batch jobs', 'Job queue', 'Large-scale processing'],
  outposts: ['AWS hardware on-premises', 'Hybrid rack', 'Same APIs in your DC'],
  wavelength: ['5G network edge', 'Telecom carrier', 'Ultra-low latency mobile'],
  ecr: ['Store container images', 'Private image registry', 'Image vulnerability scan'],

  // Storage
  s3: ['Object storage', 'Unlimited capacity', 'Static website hosting'],
  ebs: ['Block storage', 'Attached to one instance', 'Single AZ volume'],
  efs: ['Shared file system', 'NFS / Linux', 'Many instances, multi-AZ'],
  's3-glacier': ['Archive', 'Rarely accessed', 'Lowest-cost long-term'],
  'storage-gateway': ['Hybrid storage', 'On-premises to cloud', 'File / Volume / Tape'],
  'snow-family': ['Offline data transfer', 'Petabytes physically shipped', 'Edge / no internet'],
  fsx: ['Windows File Server', 'Lustre / HPC', 'Third-party file systems'],
  'aws-backup': ['Centralized backup policy', 'Across many services', 'Cross-account / cross-Region copies'],
  'elastic-disaster-recovery': ['Low RPO / RTO', 'Continuous server replication', 'Fail over to AWS'],

  // Database
  rds: ['Managed relational', 'MySQL / PostgreSQL / Oracle', 'Multi-AZ, Read Replica'],
  aurora: ['Cloud-native relational', '5x MySQL speed', 'Auto-growing storage'],
  dynamodb: ['NoSQL key-value', 'Single-digit ms latency', 'Serverless database'],
  elasticache: ['In-memory cache', 'Redis / Memcached', 'Reduce DB load'],
  redshift: ['Data warehouse', 'OLAP / analytics', 'Columnar, petabyte scale'],
  neptune: ['Graph database', 'Social network relationships', 'Recommendation graph'],
  documentdb: ['Document database', 'MongoDB-compatible', 'JSON documents'],
  qldb: ['Immutable ledger', 'Cryptographically verifiable', 'Central trusted authority'],

  // Analytics
  athena: ['SQL directly on S3', 'Serverless queries', 'Pay per data scanned'],
  emr: ['Hadoop / Spark', 'Big data clusters', 'Process huge datasets'],
  glue: ['Serverless ETL', 'Data Catalog', 'Crawlers discover schema'],
  opensearch: ['Full-text search', 'Log analytics', 'Elasticsearch successor'],
  quicksight: ['BI dashboards', 'Data visualization', 'Interactive reports'],

  // Networking
  vpc: ['Isolated private network', 'Subnets & route tables', 'Your own IP range'],
  'security-groups': ['Instance-level firewall', 'Stateful', 'Allow rules only'],
  nacls: ['Subnet-level firewall', 'Stateless', 'Allow and deny rules'],
  'route-53': ['DNS', 'Domain registration', 'Routing policies / health checks'],
  cloudfront: ['CDN', 'Edge locations caching', 'Low latency global content'],
  elb: ['Distribute traffic', 'Across multiple targets', 'ALB / NLB / GWLB'],
  'api-gateway': ['Create REST / WebSocket APIs', 'Front door for Lambda', 'Throttling & auth'],
  'direct-connect': ['Dedicated private line', 'Not over internet', 'Consistent bandwidth'],
  'site-to-site-vpn': ['Encrypted tunnel over internet', 'Quick hybrid link', 'IPsec'],
  'transit-gateway': ['Hub-and-spoke', 'Connect many VPCs', 'Central network hub'],
  'nat-gateway': ['Private subnet outbound', 'Internet for private instances', 'No inbound'],
  'global-accelerator': ['Static anycast IPs', 'AWS global backbone', 'Non-HTTP performance'],
  privatelink: ['Interface VPC endpoint', 'Private access to services', 'Traffic never on internet'],
  'client-vpn': ['Remote employees connect', 'Per-user VPN', 'OpenVPN client'],

  // Security
  iam: ['Users, groups, roles', 'Policies / permissions', 'Least privilege'],
  'iam-identity-center': ['Single sign-on (SSO)', 'Multi-account access', 'Workforce identities'],
  kms: ['Encryption keys', 'Managed key service', 'Encrypt data at rest'],
  cloudhsm: ['Dedicated hardware module', 'FIPS 140-2 Level 3', 'You control keys alone'],
  shield: ['DDoS protection', 'Standard free / Advanced paid', 'Layer 3/4 attacks'],
  waf: ['Web application firewall', 'SQL injection / XSS', 'Layer 7 rules'],
  guardduty: ['Threat detection', 'Analyzes logs with ML', 'Malicious activity'],
  inspector: ['Vulnerability scanning', 'EC2 / container CVEs', 'Software flaws'],
  macie: ['Sensitive data discovery', 'PII in S3', 'ML data classification'],
  'security-hub': ['Central security view', 'Aggregate findings', 'Compliance checks'],
  cloudtrail: ['API call history', 'Who did what, when', 'Audit trail'],
  config: ['Resource configuration history', 'Compliance rules', 'Track changes'],
  artifact: ['Compliance reports', 'SOC / PCI / ISO documents', 'Download agreements'],
  acm: ['SSL/TLS certificates', 'HTTPS', 'Auto renewal'],
  'secrets-manager': ['Store DB passwords', 'Automatic rotation', 'API keys / credentials'],
  cognito: ['App sign-up / sign-in', 'Social login', 'User pools'],
  detective: ['Investigate root cause', 'Security behavior graph', 'Analyze findings'],
  'directory-service': ['Managed Microsoft AD', 'Active Directory', 'Domain join'],
  'firewall-manager': ['Central firewall rules', 'All accounts in organization', 'WAF / SG policies'],
  ram: ['Share resources across accounts', 'Share subnets', 'Avoid duplicate resources'],

  // Serverless / integration
  'step-functions': ['Workflow orchestration', 'State machine', 'Coordinate steps'],
  sqs: ['Message queue', 'Decouple components', 'Poll-based buffer'],
  sns: ['Pub/sub', 'Push notifications', 'Email / SMS fan-out'],
  eventbridge: ['Event bus', 'Scheduled rules (cron)', 'SaaS event routing'],
  kinesis: ['Real-time streaming', 'Clickstream / IoT data', 'Ingest continuously'],

  // Management
  cloudwatch: ['Metrics & alarms', 'Logs monitoring', 'Performance dashboards'],
  cloudformation: ['Infrastructure as Code', 'JSON / YAML templates', 'Stacks'],
  cdk: ['IaC in programming languages', 'TypeScript / Python', 'Synthesizes templates'],
  'systems-manager': ['Patch fleet', 'Run commands at scale', 'Parameter Store'],
  'trusted-advisor': ['Best-practice checks', 'Cost / security / limits', 'Recommendations'],
  organizations: ['Multiple accounts', 'Service Control Policies', 'Central management'],
  'control-tower': ['Landing zone', 'Multi-account guardrails', 'Automated setup'],
  'health-dashboard': ['AWS service events', 'Outages affecting you', 'Scheduled maintenance'],
  'auto-scaling': ['Scale out / in automatically', 'Match demand', 'Scaling policies'],
  'compute-optimizer': ['Right-sizing', 'Over-provisioned resources', 'ML-based recommendations'],
  'license-manager': ['Track software licenses', 'BYOL compliance', 'Microsoft / Oracle limits'],
  'management-console': ['Web-based UI', 'Point-and-click', 'Browser access'],
  'service-catalog': ['Approved IT products', 'Self-service provisioning', 'Governed templates'],
  'service-quotas': ['Service limits', 'Request limit increase', 'Per-Region caps'],
  'well-architected-tool': ['Review workloads', 'Six pillars questions', 'Improvement plan'],

  // Developer tools
  'aws-cli': ['Command line', 'Scripts automation', 'Terminal commands'],
  codebuild: ['Compile source code', 'Run tests', 'Continuous integration'],
  codepipeline: ['CI/CD pipeline', 'Automate releases', 'Source → build → deploy'],
  'x-ray': ['Distributed tracing', 'Debug performance', 'Service map'],
  appsync: ['GraphQL API', 'Real-time subscriptions', 'Combine data sources'],
  amplify: ['Full-stack web & mobile', 'Frontend developers', 'Hosting + auth fast'],

  // Business applications
  connect: ['Cloud contact center', 'Call routing / recording', 'Customer service calls'],
  ses: ['Bulk email', 'Marketing / transactional email', 'High-volume sending'],

  // End-user computing
  appstream: ['Stream desktop apps', 'Apps in a browser', 'SaaS without code changes'],
  workspaces: ['Virtual desktop (VDI)', 'Desktop as a Service', 'Full desktop anywhere'],
  'workspaces-secure-browser': ['Secure remote browser', 'Web apps only', 'No VPN / client'],

  // IoT
  'iot-core': ['Connect IoT devices', 'MQTT messaging', 'Sensors to cloud'],

  // AI / ML
  sagemaker: ['Build, train, deploy ML', 'Data scientists', 'Custom models'],
  bedrock: ['Generative AI', 'Foundation models via API', 'LLM without training'],
  rekognition: ['Image & video analysis', 'Face detection', 'Object recognition'],
  comprehend: ['NLP', 'Sentiment analysis', 'Extract entities from text'],
  polly: ['Text-to-speech', 'Lifelike voices', 'Read text aloud'],
  transcribe: ['Speech-to-text', 'Call recordings', 'Subtitles'],
  translate: ['Language translation', 'Multilingual content', 'Localize text'],
  lex: ['Chatbot', 'Conversational interface', 'Voice & text bot'],
  kendra: ['Intelligent enterprise search', 'Natural-language questions', 'Search documents'],
  textract: ['Extract text from scans', 'Forms & tables', 'Beyond OCR'],
  personalize: ['Recommendations', 'Real-time personalization', '"Customers also bought"'],
  'amazon-q': ['Generative AI assistant', 'Code suggestions', 'Answers from company data'],

  // Migration
  dms: ['Migrate databases', 'Minimal downtime', 'Heterogeneous (SCT)'],
  'migration-hub': ['Track migration progress', 'Single place', 'Across tools'],
  mgn: ['Rehost servers', 'Lift-and-shift automation', 'Block-level replication'],
  'application-discovery': ['Discover on-premises servers', 'Map dependencies', 'Plan migration'],
  'migration-evaluator': ['Migration business case', 'Projected cloud cost', 'TCO assessment'],
  sct: ['Convert database schema', 'Oracle → Aurora', 'Heterogeneous migration'],

  // Billing
  'free-tier': ['Always free / 12 months', 'Try at no cost', 'Usage limits'],
  'pricing-calculator': ['Estimate before deploy', 'Plan cost', 'What-if pricing'],
  'cost-explorer': ['Visualize past spend', 'Forecast costs', 'Analyze trends'],
  budgets: ['Alert when exceeding', 'Custom cost threshold', 'Usage alerts'],
  'consolidated-billing': ['One bill', 'Volume discounts combined', 'Multiple accounts pay'],
  'savings-plans': ['Commit $/hour', '1 or 3 years', 'Flexible across compute'],
  'reserved-instances': ['1 or 3 year term', 'Steady-state workload', 'Up to 72% off'],
  'spot-instances': ['Up to 90% off', 'Can be interrupted', 'Fault-tolerant jobs'],
  'support-plans': ['Basic / Developer / Business / Enterprise', 'TAM', 'Response times'],
  marketplace: ['Third-party software', 'Buy & deploy AMIs', 'Billed through AWS'],
  'cost-usage-report': ['Most detailed billing data', 'Hourly line items', 'Delivered to S3'],
}

/** Keywords for a service, falling back to an empty list when none are defined. */
export function examKeywordsFor(serviceId: string): readonly string[] {
  return EXAM_KEYWORDS[serviceId] ?? []
}
