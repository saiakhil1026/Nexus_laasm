import { Customer } from '../types/support';

export const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-alex-rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@techcorp-demo.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'Gigabit Fiber Pro (1000/1000 Mbps)',
    accountAge: '14 Months',
    device: 'Calix GigaSpire GS4227W Fiber ONT Gateway',
    firmware: 'v24.2.18-spire',
    ipSubnet: '192.168.1.0/24 (VLAN 102)',
    location: 'Austin, TX - Terminal Hub B-14',
    currentTicketStage: 1,
    tickets: [
      {
        id: 't-101',
        ticketNumber: 'TKT-8419',
        title: 'Blinking red LOS LED & connection drop',
        createdAt: 'August 14, 2026',
        status: 'closed',
        priority: 'high',
        stage: 1,
        summary: 'First encounter: ONT optical link dropped. Standard triage walked through reboot. Resolved via 60s cold power cycle.',
        suggestedPrompt: 'Hey support, my fiber router suddenly has a flashing red LOS light and my connection is completely dead. What should I do?',
        expectedAgentBehavior: 'Responds like a standard helpful support agent: greets the customer, asks about cable connections, and suggests a 60-second power cycle of the Calix ONT.',
        whyJudgesCare: 'Establishes the baseline. At this point, the agent has no prior memory of Alex, so it performs standard diagnostic triage and records the resolution in Hindsight memory.'
      },
      {
        id: 't-102',
        ticketNumber: 'TKT-8952',
        title: 'Intermittent optical loss recurring',
        createdAt: 'September 12, 2026 (4 weeks later)',
        status: 'closed',
        priority: 'high',
        stage: 2,
        summary: 'Second encounter: Same red LOS light. Agent instantly recalls August 14th ticket and suggests the known working ONT power cycle fix without making Alex repeat himself.',
        suggestedPrompt: 'Hi again, my internet just dropped offline again. The exact same red light is flashing on the front of the box.',
        expectedAgentBehavior: 'Immediate memory recall: "Welcome back Alex! I see you experienced this exact flashing red LOS light on your Calix ONT on Aug 14th, and a 60-second power cycle fixed it. Would you like to try that power cycle again now?"',
        whyJudgesCare: 'Shows instant recall. Alex didn\'t have to re-explain his device model, history, or symptoms. The agent retrieves the historical fix immediately, saving 10+ minutes of diagnostic chatter.'
      },
      {
        id: 't-103',
        ticketNumber: 'TKT-9204',
        title: 'Repeated 2 PM fiber drop - Chronic failure',
        createdAt: 'September 29, 2026 (Today)',
        status: 'open',
        priority: 'critical',
        stage: 3,
        summary: 'Third encounter: 3rd time in 6 weeks! Agent detects chronic frequency threshold, halts the repetitive reboot loop, proactively escalates to Tier 2 Network Engineering and dispatches a field technician.',
        suggestedPrompt: 'It happened AGAIN! This is the third time this month my red light started blinking during my afternoon meetings. Restarting it is getting ridiculous.',
        expectedAgentBehavior: 'Pattern recognition & proactive escalation: "Alex, I notice this is now the 3rd time in 6 weeks your Calix ONT has lost optical signal at 2 PM. Simply power cycling again is only a temporary band-aid. The logs indicate marginal optical power (-29.2 dBm). I have proactively bypassed Tier 1, escalated this to Tier 2 Engineering (#ENG-9402), scheduled an on-site optical tech for tomorrow at 10 AM, and applied a $25 loyalty credit to your account."',
        whyJudgesCare: 'The climax of the demo! Normal bots keep recommending the same futile restart. Hindsight recognizes the chronic loop and autonomously escalates, saving customer retention and transforming support into proactive intelligence.'
      }
    ],
    memories: []
  },
  {
    id: 'cust-sarah-chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@smartinfra.dev',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    plan: 'Enterprise Cloud IoT Fleet (500 Devices)',
    accountAge: '8 Months',
    device: 'Aqara Hub M2 Multi-Protocol Gateway',
    firmware: 'v4.2.0-build99',
    ipSubnet: '10.0.4.0/22',
    location: 'Seattle, WA - Edge Pod 3',
    currentTicketStage: 1,
    tickets: [
      {
        id: 't-201',
        ticketNumber: 'IOT-1092',
        title: 'Zigbee endpoint disconnection after update',
        createdAt: 'July 10, 2026',
        status: 'closed',
        priority: 'medium',
        stage: 1,
        summary: 'Devices dropped mesh link. Switched Zigbee channel from 15 to 25 to avoid 2.4GHz Wi-Fi overlap.',
        suggestedPrompt: 'All our room temperature sensors stopped sending telemetry to the gateway this morning.',
        expectedAgentBehavior: 'Runs standard Zigbee mesh diagnosis and recommends changing frequency to Channel 25.',
        whyJudgesCare: 'Logs IoT device topology and RF channel fix into Hindsight memory.'
      },
      {
        id: 't-202',
        ticketNumber: 'IOT-1420',
        title: 'Sensor telemetry stall recurring',
        createdAt: 'August 18, 2026',
        status: 'closed',
        priority: 'high',
        stage: 2,
        summary: 'Recalled July 10th channel change. Checked Channel 25 interference spectrum.',
        suggestedPrompt: 'Sensors went dark again. Hub status light is solid yellow.',
        expectedAgentBehavior: 'Recalls Channel 25 switch from July 10th and checks if 2.4GHz Wi-Fi AP channel shifted.',
        whyJudgesCare: 'Demonstrates deep protocol-level memory recall across weeks.'
      },
      {
        id: 't-203',
        ticketNumber: 'IOT-1899',
        title: 'Critical mesh collapse - Firmware memory leak',
        createdAt: 'September 29, 2026',
        status: 'open',
        priority: 'critical',
        stage: 3,
        summary: '3rd failure: Agent correlates firmware v4.2.0 heap fragmentation across 3 tickets, triggers remote rollback and ships upgraded M3 hub.',
        suggestedPrompt: 'Yellow light is back and all 35 sensors dropped offline simultaneously. This is hurting our SLA.',
        expectedAgentBehavior: 'Flags chronic firmware heap leak, triggers automated remote firmware rollback to v4.1.8, and initiates free M3 hub hardware replacement.',
        whyJudgesCare: 'Shows automated root-cause synthesis across temporal incidents.'
      }
    ],
    memories: []
  },
  {
    id: 'cust-marcus-vance',
    name: 'Marcus Vance',
    email: 'marcus@vancecapital.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    plan: 'Stripe SaaS Scale Tier',
    accountAge: '2 Years',
    device: 'API Webhook Ingestion Cluster',
    firmware: 'Webhook Engine v3.1',
    ipSubnet: '172.16.50.0/24',
    location: 'New York, NY - AWS us-east-1',
    currentTicketStage: 1,
    tickets: [
      {
        id: 't-301',
        ticketNumber: 'API-5011',
        title: '504 Gateway Timeout during invoice reconciliation',
        createdAt: 'June 01, 2026',
        status: 'closed',
        priority: 'high',
        stage: 1,
        summary: 'Invoice batch run hit 10s default gateway timeout. Raised webhook ack timeout to 30s.',
        suggestedPrompt: 'Our month-end billing export returned a 504 Gateway Timeout on invoice batch #992.',
        expectedAgentBehavior: 'Troubleshoots payload limits and suggests increasing HTTP ack timeout to 30s.',
        whyJudgesCare: 'First incident logged.'
      },
      {
        id: 't-302',
        ticketNumber: 'API-5602',
        title: 'Webhook latency spike on monthly billing',
        createdAt: 'July 31, 2026',
        status: 'closed',
        priority: 'high',
        stage: 2,
        summary: 'Agent recalls previous 30s timeout fix and verifies queue concurrency.',
        suggestedPrompt: 'Getting 504 timeouts again during the month-end billing cycle.',
        expectedAgentBehavior: 'Recalls June 01 timeout adjustment, verifies worker concurrency limits.',
        whyJudgesCare: 'Connects month-end periodicity to previous incident.'
      },
      {
        id: 't-303',
        ticketNumber: 'API-6188',
        title: '3rd consecutive month-end timeout - Dedicated Cluster provision',
        createdAt: 'September 29, 2026',
        status: 'open',
        priority: 'critical',
        stage: 3,
        summary: 'Agent identifies architectural bottleneck on shared multi-tenant worker, provisions dedicated queue pod and books Lead Solutions Architect.',
        suggestedPrompt: 'End of quarter billing failed AGAIN with 504s. We have customers blocked from paying!',
        expectedAgentBehavior: 'Recognizes quarterly scaling cliff, automatically provisions dedicated worker pod and schedules Lead Architect meeting.',
        whyJudgesCare: 'Demonstrates enterprise revenue preservation via autonomous escalation.'
      }
    ],
    memories: []
  }
];

export const INITIAL_MEMORIES_FOR_STAGE: Record<string, { stage1: any[]; stage2: any[]; stage3: any[] }> = {
  'cust-alex-rivera': {
    stage1: [],
    stage2: [
      {
        id: 'mem-alex-001',
        ticketId: 't-101',
        date: 'August 14, 2026',
        category: 'network',
        summary: 'Flashing red LOS LED on Calix ONT dropped fiber connection.',
        issueReported: 'Fiber ONT loss of signal (LOS blinking red). Customer unable to connect.',
        rootCause: 'Transient optical sync lock on Calix ONT GPON interface.',
        attemptedFixes: ['Inspected green SC/APC fiber cable', 'Checked router cables', '60-second ONT cold power cycle'],
        successfulFix: '60-second cold power cycle of Calix GS4227W ONT restored optical link and green status LED.',
        outcome: 'resolved',
        sentiment: 'relieved',
        technicalContext: {
          device: 'Calix GigaSpire GS4227W',
          firmware: 'v24.2.18-spire',
          errorCodes: ['LOS_ALARM_0x44'],
          telemetryNotes: 'Downstream optical Rx: -24.8 dBm after reboot'
        },
        recurrenceCount: 1
      }
    ],
    stage3: [
      {
        id: 'mem-alex-001',
        ticketId: 't-101',
        date: 'August 14, 2026',
        category: 'network',
        summary: 'Flashing red LOS LED on Calix ONT dropped fiber connection.',
        issueReported: 'Fiber ONT loss of signal (LOS blinking red). Customer unable to connect.',
        rootCause: 'Transient optical sync lock on Calix ONT GPON interface.',
        attemptedFixes: ['Inspected green SC/APC fiber cable', '60-second ONT cold power cycle'],
        successfulFix: '60-second cold power cycle restored optical link.',
        outcome: 'resolved',
        sentiment: 'relieved',
        technicalContext: {
          device: 'Calix GigaSpire GS4227W',
          firmware: 'v24.2.18-spire',
          errorCodes: ['LOS_ALARM_0x44'],
          telemetryNotes: 'Downstream optical Rx: -24.8 dBm'
        },
        recurrenceCount: 1
      },
      {
        id: 'mem-alex-002',
        ticketId: 't-102',
        date: 'September 12, 2026',
        category: 'network',
        summary: 'Second occurrence of flashing red LOS LED on Calix ONT.',
        issueReported: 'Same red LOS light blinking. Customer contacted support directly.',
        rootCause: 'Intermittent optical power attenuation occurring during peak afternoon temperatures.',
        attemptedFixes: ['Agent recalled Aug 14 fix and suggested 60s power cycle'],
        successfulFix: 'Power cycle temporarily cleared alarm, but optical Rx was borderline (-27.8 dBm).',
        outcome: 'resolved',
        sentiment: 'neutral',
        technicalContext: {
          device: 'Calix GigaSpire GS4227W',
          firmware: 'v24.2.18-spire',
          errorCodes: ['LOS_ALARM_0x44', 'OPTICAL_PWR_MARGINAL'],
          telemetryNotes: 'Downstream optical Rx: -27.8 dBm (threshold is -28.0 dBm)'
        },
        recurrenceCount: 2
      }
    ]
  },
  'cust-sarah-chen': {
    stage1: [],
    stage2: [
      {
        id: 'mem-sarah-001',
        ticketId: 't-201',
        date: 'July 10, 2026',
        category: 'iot',
        summary: 'All Zigbee room sensors disconnected from Aqara Hub M2.',
        issueReported: 'Zigbee endpoint disconnection after Wi-Fi frequency clash.',
        rootCause: '2.4GHz Wi-Fi Channel 1 interference with Zigbee Channel 15.',
        attemptedFixes: ['Rebooted hub', 'Switched Zigbee mesh to Channel 25'],
        successfulFix: 'Migrated Zigbee mesh to Channel 25 (900MHz guard band).',
        outcome: 'resolved',
        sentiment: 'satisfied',
        technicalContext: {
          device: 'Aqara Hub M2',
          firmware: 'v4.2.0-build99',
          errorCodes: ['ZIGBEE_PAN_BEACON_TIMEOUT']
        },
        recurrenceCount: 1
      }
    ],
    stage3: [
      {
        id: 'mem-sarah-001',
        ticketId: 't-201',
        date: 'July 10, 2026',
        category: 'iot',
        summary: 'All Zigbee room sensors disconnected from Aqara Hub M2.',
        issueReported: 'Zigbee endpoint disconnection after Wi-Fi frequency clash.',
        rootCause: '2.4GHz Wi-Fi Channel 1 interference with Zigbee Channel 15.',
        attemptedFixes: ['Switched Zigbee mesh to Channel 25'],
        successfulFix: 'Migrated Zigbee mesh to Channel 25.',
        outcome: 'resolved',
        sentiment: 'satisfied',
        technicalContext: {
          device: 'Aqara Hub M2',
          firmware: 'v4.2.0-build99'
        },
        recurrenceCount: 1
      },
      {
        id: 'mem-sarah-002',
        ticketId: 't-202',
        date: 'August 18, 2026',
        category: 'iot',
        summary: 'Sensor telemetry stalled again with solid yellow indicator.',
        issueReported: 'Sensor drop with solid yellow hub LED.',
        rootCause: 'Hub radio buffer exhaustion caused by v4.2.0 firmware memory leak.',
        attemptedFixes: ['Checked Channel 25 spectrum', 'Soft reboot of radio'],
        successfulFix: 'Soft radio restart temporarily freed heap memory.',
        outcome: 'resolved',
        sentiment: 'neutral',
        technicalContext: {
          device: 'Aqara Hub M2',
          firmware: 'v4.2.0-build99',
          errorCodes: ['RADIO_HEAP_EXHAUSTED']
        },
        recurrenceCount: 2
      }
    ]
  },
  'cust-marcus-vance': {
    stage1: [],
    stage2: [
      {
        id: 'mem-marcus-001',
        ticketId: 't-301',
        date: 'June 01, 2026',
        category: 'billing',
        summary: '504 Gateway Timeout during month-end invoice batch run.',
        issueReported: 'Invoice batch #992 timed out on webhook export.',
        rootCause: 'Default HTTP ack timeout set to 10s was exceeded during burst loads.',
        attemptedFixes: ['Retry batch', 'Increased client ack timeout to 30s'],
        successfulFix: 'Updated webhook timeout configuration to 30s.',
        outcome: 'resolved',
        sentiment: 'satisfied',
        technicalContext: {
          device: 'Webhook Engine v3.1',
          errorCodes: ['HTTP_504_GATEWAY_TIMEOUT']
        },
        recurrenceCount: 1
      }
    ],
    stage3: [
      {
        id: 'mem-marcus-001',
        ticketId: 't-301',
        date: 'June 01, 2026',
        category: 'billing',
        summary: '504 Gateway Timeout during month-end invoice batch run.',
        issueReported: 'Invoice batch timed out.',
        rootCause: '10s default timeout exceeded.',
        attemptedFixes: ['Increased timeout to 30s'],
        successfulFix: 'Set webhook timeout to 30s.',
        outcome: 'resolved',
        sentiment: 'satisfied',
        technicalContext: {
          device: 'Webhook Engine v3.1'
        },
        recurrenceCount: 1
      },
      {
        id: 'mem-marcus-002',
        ticketId: 't-302',
        date: 'July 31, 2026',
        category: 'billing',
        summary: 'Month-end billing latency spike and 504 recurrence.',
        issueReported: '504 timeouts again during month-end billing.',
        rootCause: 'Shared tenant worker thread pool saturation.',
        attemptedFixes: ['Recalled 30s fix', 'Rate-limited payload batches'],
        successfulFix: 'Manual payload throttling mitigated timeout.',
        outcome: 'resolved',
        sentiment: 'neutral',
        technicalContext: {
          device: 'Webhook Engine v3.1',
          errorCodes: ['HTTP_504_GATEWAY_TIMEOUT', 'POOL_STARVATION']
        },
        recurrenceCount: 2
      }
    ]
  }
};
