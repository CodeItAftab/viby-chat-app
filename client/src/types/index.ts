export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
  messages?: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file" | "voice" | "video" | "audio";
  status: "sent" | "delivered" | "read";
  fileUrl?: string;
  fileSize?: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  mutualFriends?: number;
  location?: string;
  friendsSince?: string;
}

export interface Call {
  id: string;
  name: string;
  avatar: string;
  type: "incoming" | "outgoing" | "missed";
  timestamp: string;
  duration?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "message" | "call" | "system" | "friend_request";
  priority?: "low" | "medium" | "high";
  actionUrl?: string;
  senderId?: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  email?: string;
  bio?: string;
  online?: boolean;
  mutualFriendsCount?: number;
  location?: string;
  type?: "user" | "friend" | "sent_req" | "req";
  age?: number;
  dob?: string;
  requestId?: string;
  chatId?: string;
  friendsSince?: string;
}

export interface FriendRequest {
  _id: string;
  createdAt?: string;
  receiver?: {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
    mutualFriendsCount?: number;
  };
  sender?: {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
    mutualFriendsCount?: number;
  };
  // status: "pending" | "accepted" | "declined";
}

export interface SearchFilters {
  location?: string;
  ageRange?: [number, number];
  interests?: string[];
  mutualFriends?: boolean;
  onlineOnly?: boolean;
}

export interface ProfileData {
  name: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  birthday: string;
  status: string;
}

export interface PrivacySettings {
  profileVisibility: string;
  lastSeen: boolean;
  readReceipts: boolean;
  onlineStatus: boolean;
  twoFactorAuth: boolean;
  dataCollection: boolean;
  analyticsSharing: boolean;
  locationSharing: boolean;
  contactSync: boolean;
}

export interface MessageSettings {
  enterToSend: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  previewEnabled: boolean;
  fontSize: number[];
  bubbleStyle: string;
  timeFormat: string;
  groupNotifications: boolean;
  mentionNotifications: boolean;
  keywordNotifications: string[];
  autoDownloadMedia: string;
  linkPreviews: boolean;
  emojiSuggestions: boolean;
  spellCheck: boolean;
  autoCorrect: boolean;
}

export interface CallSettings {
  ringtoneVolume: number[];
  vibrationEnabled: boolean;
  callWaiting: boolean;
  voicemail: boolean;
  callRecording: boolean;
  noiseReduction: boolean;
  echoCancellation: boolean;
  autoAnswer: boolean;
  callForwarding: boolean;
  doNotDisturb: boolean;
  ringtone: string;
  callTheme: string;
}

export interface DataSettings {
  autoDownload: string;
  backupEnabled: boolean;
  storageUsed: string;
  storageLimit: string;
  lastBackup: string;
  backupFrequency: string;
  compressionEnabled: boolean;
  cloudSync: boolean;
  localBackup: boolean;
  dataUsage: {
    thisMonth: string;
    lastMonth: string;
    average: string;
  };
}

export interface LanguageSettings {
  language: string;
  region: string;
  dateFormat: string;
  timeZone: string;
  currency: string;
  numberFormat: string;
}

export interface SecuritySettings {
  screenLock: boolean;
  biometric: boolean;
  autoLock: string;
  hideContent: boolean;
  incognito: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
  suspiciousActivity: boolean;
  deviceManagement: boolean;
  encryptionLevel: string;
}

// Auth related types
export interface AuthUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface RootState {
  auth: AuthState;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  user?: AuthUser;
  data?: T;
}

export interface ApiError {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
}

// Auth API data types
export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: File;
  bio?: string;
  phone?: string;
  location?: string;
}
