// Rewards data
export const rewards = [
  {
    id: "gym-discount",
    title: "50% Off Gym Membership",
    description: "Maintain excellent posture for 14 consecutive days to unlock this reward.",
    imageUrl: "https://images.unsplash.com/photo-1494178270175-e96de6971df1?auto=format&fit=crop&w=500&q=80",
    level: "Gold",
    levelColor: "from-amber-400 to-amber-600",
    progress: {
      current: 9,
      total: 14,
      percentage: 65
    },
    requirements: {
      type: "streak",
      days: 14
    },
    partnerInfo: {
      name: "FitLife Gym",
      website: "https://example.com/fitlife",
      validUntil: "2023-12-31"
    },
    value: "$30 value"
  },
  {
    id: "chair-discount",
    title: "20% Off Ergonomic Chairs",
    description: "Achieve an average posture score of 85+ for 7 days to unlock this reward.",
    imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=500&q=80",
    level: "Silver",
    levelColor: "from-primary-400 to-primary-600",
    progress: {
      current: 7,
      total: 7,
      percentage: 100
    },
    requirements: {
      type: "score",
      threshold: 85,
      days: 7
    },
    partnerInfo: {
      name: "ErgoComfort",
      website: "https://example.com/ergocomfort",
      validUntil: "2023-12-31"
    },
    value: "$50+ value"
  },
  {
    id: "wellness-app",
    title: "Free Wellness App Subscription",
    description: "Complete 5 posture analysis sessions to unlock this reward.",
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=500&q=80",
    level: "Bronze",
    levelColor: "from-emerald-400 to-emerald-600",
    progress: {
      current: 5,
      total: 5,
      percentage: 100
    },
    requirements: {
      type: "sessions",
      count: 5
    },
    partnerInfo: {
      name: "MindBody Wellness",
      website: "https://example.com/mindbody",
      validUntil: "2023-12-31"
    },
    value: "$15 value"
  },
  {
    id: "massage-discount",
    title: "15% Off Massage Therapy",
    description: "Complete all beginner posture exercises to unlock this reward.",
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
    level: "Bronze",
    levelColor: "from-emerald-400 to-emerald-600",
    progress: {
      current: 2,
      total: 4,
      percentage: 50
    },
    requirements: {
      type: "exercises",
      level: "Beginner",
      count: 4
    },
    partnerInfo: {
      name: "Relaxation Studio",
      website: "https://example.com/relaxation",
      validUntil: "2023-12-31"
    },
    value: "$20 value"
  },
  {
    id: "standing-desk",
    title: "10% Off Standing Desks",
    description: "Maintain good posture (85+ score) during 10 work sessions to unlock this reward.",
    imageUrl: "https://images.unsplash.com/photo-1542546068979-b6affb46ea8f?auto=format&fit=crop&w=500&q=80",
    level: "Silver",
    levelColor: "from-primary-400 to-primary-600",
    progress: {
      current: 6,
      total: 10,
      percentage: 60
    },
    requirements: {
      type: "work_sessions",
      score: 85,
      count: 10
    },
    partnerInfo: {
      name: "Modern Office",
      website: "https://example.com/modernoffice",
      validUntil: "2023-12-31"
    },
    value: "$40+ value"
  },
  {
    id: "posture-course",
    title: "Free Posture Improvement Course",
    description: "Refer 3 friends to PostureCheck to unlock this premium educational content.",
    imageUrl: "https://images.unsplash.com/photo-1564106273110-e1086c71d5b8?auto=format&fit=crop&w=500&q=80",
    level: "Gold",
    levelColor: "from-amber-400 to-amber-600",
    progress: {
      current: 0,
      total: 3,
      percentage: 0
    },
    requirements: {
      type: "referrals",
      count: 3
    },
    partnerInfo: {
      name: "PostureCheck Academy",
      website: "https://example.com/postureacademy",
      validUntil: "2023-12-31"
    },
    value: "$75 value"
  }
];
