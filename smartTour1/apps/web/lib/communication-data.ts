export type MessageType = "broadcast" | "direct" | "emergency" | "group" | "auto";
export type MessageStatus = "sent" | "delivered" | "read" | "failed" | "pending";
export type Priority = "low" | "normal" | "high" | "critical";

export interface Message {
  id: string;
  type: MessageType;
  priority: Priority;
  sender: string;
  senderRole: string;
  recipients: string[];
  recipientCount: number;
  subject: string;
  body: string;
  sentAt: string;
  status: MessageStatus;
  readCount?: number;
  replyCount?: number;
  channel: "push" | "sms" | "email" | "in-app" | "all";
  acknowledged?: boolean;
}

export interface Conversation {
  id: string;
  touristId: string;
  touristName: string;
  touristStatus: "safe" | "warning" | "emergency";
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: {
    id: string;
    from: "tourist" | "admin";
    text: string;
    time: string;
    status: MessageStatus;
  }[];
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: MessageType;
  priority: Priority;
  channel: "push" | "sms" | "email" | "in-app" | "all";
}

export const communicationStats = {
  sentToday: 47,
  delivered: 45,
  failed: 2,
  pending: 0,
  responseRate: "87%",
  avgReadTime: "3m 24s",
  activeConversations: 12,
};

export const templates: Template[] = [
  {
    id: "TMP-001",
    name: "Weather Warning",
    subject: "Weather Alert",
    body: "Severe weather detected in your area. Please return to the nearest shelter immediately and await further instructions.",
    type: "broadcast",
    priority: "high",
    channel: "all",
  },
  {
    id: "TMP-002",
    name: "Check-in Request",
    subject: "Routine Check-in",
    body: "This is an automated check-in. Please confirm your status by pressing the green button on your device or replying SAFE.",
    type: "auto",
    priority: "normal",
    channel: "push",
  },
  {
    id: "TMP-003",
    name: "Trail Closure",
    subject: "Trail Temporarily Closed",
    body: "The trail ahead is temporarily closed due to maintenance. Please follow the marked detour. Estimated reopening: 2 hours.",
    type: "broadcast",
    priority: "normal",
    channel: "push",
  },
  {
    id: "TMP-004",
    name: "Evacuation Order",
    subject: "IMMEDIATE EVACUATION",
    body: "EVACUATION ORDER: Leave the area immediately via the nearest marked exit. Do not delay. Proceed to Base Camp for headcount.",
    type: "emergency",
    priority: "critical",
    channel: "all",
  },
  {
    id: "TMP-005",
    name: "Low Battery Warning",
    subject: "Device Battery Low",
    body: "Your safety device battery is below 20%. Please return to base camp for charging or activate power-saving mode.",
    type: "auto",
    priority: "high",
    channel: "push",
  },
  {
    id: "TMP-006",
    name: "Welcome Message",
    subject: "Welcome to TourGuard",
    body: "Welcome! Your safety device is now active. Stay on marked trails, respect geofence boundaries, and press SOS if you need help.",
    type: "direct",
    priority: "low",
    channel: "in-app",
  },
];

export const messages: Message[] = [
  {
    id: "MSG-2025-047",
    type: "emergency",
    priority: "critical",
    sender: "Admin",
    senderRole: "System Administrator",
    recipients: ["All Tourists", "All Teams"],
    recipientCount: 139,
    subject: "Flash Flood Warning — Immediate Action Required",
    body: "All personnel in River Valley and downstream zones must evacuate to high ground immediately. This is not a drill. Follow ranger instructions.",
    sentAt: "2025-05-20T08:05:00",
    status: "delivered",
    readCount: 137,
    replyCount: 0,
    channel: "all",
    acknowledged: true,
  },
  {
    id: "MSG-2025-046",
    type: "broadcast",
    priority: "high",
    sender: "Ranger Mike Chen",
    senderRole: "Search & Rescue Lead",
    recipients: ["Response Team Alpha", "Response Team Beta"],
    recipientCount: 8,
    subject: "Rocky Ridge Incident — All Hands",
    body: "T003 fall confirmed at Rocky Ridge Pass. Medical evac inbound. All nearby rangers redirect to LZ coordinates. Standby for updates.",
    sentAt: "2025-05-20T10:28:00",
    status: "read",
    readCount: 8,
    replyCount: 3,
    channel: "push",
  },
  {
    id: "MSG-2025-045",
    type: "direct",
    priority: "normal",
    sender: "Admin",
    senderRole: "System Administrator",
    recipients: ["T091 (Sarah Johnson)"],
    recipientCount: 1,
    subject: "Post-Incident Follow-up",
    body: "Hi Sarah, we hope you're recovering well. Please confirm if you need any further assistance or have questions about the incident report.",
    sentAt: "2025-05-20T09:55:00",
    status: "read",
    readCount: 1,
    replyCount: 1,
    channel: "email",
  },
  {
    id: "MSG-2025-044",
    type: "auto",
    priority: "normal",
    sender: "System",
    senderRole: "Automated",
    recipients: ["T077 (Lakshmi Iyer)"],
    recipientCount: 1,
    subject: "Low Battery Alert",
    body: "Your device battery is at 18%. Power-saving mode activated. Please return to base camp for charging.",
    sentAt: "2025-05-20T10:20:00",
    status: "delivered",
    readCount: 1,
    replyCount: 0,
    channel: "push",
  },
  {
    id: "MSG-2025-043",
    type: "group",
    priority: "high",
    sender: "Commander Arjun Mehta",
    senderRole: "Operations Commander",
    recipients: ["Gamma Group"],
    recipientCount: 5,
    subject: "Group Check-in Required",
    body: "Gamma Group: Please confirm your location and status. We show one member outside the designated camp perimeter.",
    sentAt: "2025-05-20T10:15:00",
    status: "delivered",
    readCount: 4,
    replyCount: 2,
    channel: "push",
  },
  {
    id: "MSG-2025-042",
    type: "broadcast",
    priority: "normal",
    sender: "Admin",
    senderRole: "System Administrator",
    recipients: ["All Tourists"],
    recipientCount: 127,
    subject: "Sunset View Point Closure",
    body: "Sunset View Point is temporarily closed for maintenance. We apologize for the inconvenience. Alternative viewpoint: Hill Top Trail Checkpoint 2.",
    sentAt: "2025-05-20T09:00:00",
    status: "read",
    readCount: 118,
    replyCount: 0,
    channel: "in-app",
  },
  {
    id: "MSG-2025-041",
    type: "emergency",
    priority: "critical",
    sender: "System",
    senderRole: "Automated",
    recipients: ["T024 (Neha Verma)", "Response Team Alpha"],
    recipientCount: 3,
    subject: "Fall Detected — No Movement",
    body: "ALERT: Fall detected for T024 near Hill Top Trail. No movement for 45 seconds. GPS coordinates transmitted. Emergency response dispatched.",
    sentAt: "2025-05-20T10:22:00",
    status: "delivered",
    readCount: 3,
    replyCount: 1,
    channel: "all",
  },
  {
    id: "MSG-2025-040",
    type: "direct",
    priority: "normal",
    sender: "Ranger David Okafor",
    senderRole: "Ranger Unit 3",
    recipients: ["T056 (Ananya Desai)"],
    recipientCount: 1,
    subject: "Wildlife Encounter Follow-up",
    body: "Hi Ananya, just checking in after the bear sighting earlier. Are you feeling okay to continue? Reply if you need an escort back to camp.",
    sentAt: "2025-05-20T10:25:00",
    status: "read",
    readCount: 1,
    replyCount: 1,
    channel: "sms",
  },
];

export const conversations: Conversation[] = [
  {
    id: "CONV-001",
    touristId: "T056",
    touristName: "Ananya Desai",
    touristStatus: "safe",
    lastMessage: "I'm okay, just a bit shaken. I'll head back now.",
    lastMessageTime: "2025-05-20T10:26:00",
    unread: 0,
    messages: [
      {
        id: "m1",
        from: "admin",
        text: "Hi Ananya, just checking in after the bear sighting earlier. Are you feeling okay to continue? Reply if you need an escort back to camp.",
        time: "10:25 AM",
        status: "read",
      },
      {
        id: "m2",
        from: "tourist",
        text: "I'm okay, just a bit shaken. I'll head back now.",
        time: "10:26 AM",
        status: "read",
      },
    ],
  },
  {
    id: "CONV-002",
    touristId: "T045",
    touristName: "Arjun Mehta",
    touristStatus: "emergency",
    lastMessage: "SOS — I'm disoriented near the river. Can't find the trail.",
    lastMessageTime: "2025-05-20T10:16:00",
    unread: 1,
    messages: [
      {
        id: "m1",
        from: "tourist",
        text: "SOS — I'm disoriented near the river. Can't find the trail.",
        time: "10:16 AM",
        status: "delivered",
      },
      {
        id: "m2",
        from: "admin",
        text: "Arjun, stay where you are. Do not move. Response Team Beta is en route to your location. Keep your device visible.",
        time: "10:17 AM",
        status: "read",
      },
      {
        id: "m3",
        from: "tourist",
        text: "Okay I'm staying put. I can hear the water.",
        time: "10:19 AM",
        status: "read",
      },
    ],
  },
  {
    id: "CONV-003",
    touristId: "T091",
    touristName: "Sarah Johnson",
    touristStatus: "safe",
    lastMessage: "Thank you for checking in. I'm feeling much better now.",
    lastMessageTime: "2025-05-20T09:58:00",
    unread: 0,
    messages: [
      {
        id: "m1",
        from: "admin",
        text: "Hi Sarah, we hope you're recovering well. Please confirm if you need any further assistance.",
        time: "09:55 AM",
        status: "read",
      },
      {
        id: "m2",
        from: "tourist",
        text: "Thank you for checking in. I'm feeling much better now.",
        time: "09:58 AM",
        status: "read",
      },
    ],
  },
  {
    id: "CONV-004",
    touristId: "T003",
    touristName: "James Wilson",
    touristStatus: "emergency",
    lastMessage: "Can someone hear me? I've fallen and my leg is hurt.",
    lastMessageTime: "2025-05-20T10:25:00",
    unread: 2,
    messages: [
      {
        id: "m1",
        from: "tourist",
        text: "Can someone hear me? I've fallen and my leg is hurt.",
        time: "10:25 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "CONV-005",
    touristId: "T024",
    touristName: "Neha Verma",
    touristStatus: "emergency",
    lastMessage: "Help me... I can't get up.",
    lastMessageTime: "2025-05-20T10:22:00",
    unread: 1,
    messages: [
      {
        id: "m1",
        from: "tourist",
        text: "Help me... I can't get up.",
        time: "10:22 AM",
        status: "delivered",
      },
      {
        id: "m2",
        from: "admin",
        text: "Neha, help is on the way. Stay still and keep your device active. We can see your location.",
        time: "10:23 AM",
        status: "read",
      },
    ],
  },
];