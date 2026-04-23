export const STATUS = {
  INACTIVE: 2,
  ACTIVE: 1,
} as const;

export type StatusEnum = (typeof STATUS)[keyof typeof STATUS];

export const REASON_ADMIN_APPROVAL = {
  ACCEPTED: 1,
  REJECTED: 2,
  WAITING: 3,
} as const;

export type ReasonAdminApprovalEnum =
  (typeof REASON_ADMIN_APPROVAL)[keyof typeof REASON_ADMIN_APPROVAL];

export const CREATING_TYPE = {
  SUPER_ADMIN: 1,
  BRANCH: 2,
  DELEGATE: 3,
  CLIENT: 4,
  SERVER: 5,
} as const;

export type CreatingTypeEnum =
  (typeof CREATING_TYPE)[keyof typeof CREATING_TYPE];

export const REASON_TYPE = {
  NEW: 1,
  DELAYING: 2,
  DELAYED: 3,
  PROCESSING: 4,
  DONE: 5,
  REJECTED: 6,
  CANCELLED: 7,
  TRANSFER: 8,
} as const;

export type ReasonTypeEnum = (typeof REASON_TYPE)[keyof typeof REASON_TYPE];

export const LANGUAGES = {
  ARABIC: 1,
  ENGLISH: 2,
} as const;

export type LanguageEnum = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const CLIENT_GROUP_FILTER = {
  ALL: 0,
  WITH_GROUP: 1,
  WITHOUT_GROUP: 2,
} as const;

export type ClientGroupFilterEnum =
  (typeof CLIENT_GROUP_FILTER)[keyof typeof CLIENT_GROUP_FILTER];
