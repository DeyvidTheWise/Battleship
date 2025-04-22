// client/src/shared-types/index.ts
// Atom Types
export interface ButtonProps {
  text: string
  onClick: () => void
  variant?: "primary" | "secondary" | "disabled"
}

export interface TextProps {
  content: string
  variant: "title" | "body" | "label" | "secondary"
  onClick?: () => void // Added onClick prop
}

export interface GridCellProps {
  state: GridState
  onClick: () => void
  onHover: () => void
}

export interface TimerRingProps {
  time: number // in seconds
  totalTime: number // in seconds
}

export interface IconProps {
  name: "ship" | "chat" | "friend"
  variant?: "active" | "inactive"
}

export interface DotIndicatorProps {
  variant: "hit" | "miss"
}

export interface AvatarProps {
  src?: string
  alt?: string
  size?: number
}

export interface StatItemProps {
  label: string
  value: string | number
}

export interface BadgeProps {
  isUnlocked: boolean
  label: string
}

export interface TableCellProps {
  content: string | number
  isHighlighted?: boolean
}

export interface DropdownItemProps {
  label: string
  onClick: () => void
}

export interface SidebarItemProps {
  label: string
  icon: "ship" | "chat" | "friend"
  onClick: () => void
  isActive?: boolean
}

export interface ChartPointProps {
  x: number
  y: number
  value: number
}

// Molecule Types
export interface HeroSectionProps {
  onPlayClick: () => void
}

export interface GridRowProps {
  row: GridState[]
  rowNumber: number
  onCellClick: (colIdx: number) => void
  onCellHover: (colIdx: number) => void
}

export interface GridProps {
  grid: GridState[][]
  label: string
  onCellClick: (row: number, col: number) => void
  onCellHover: (row: number, col: number) => void
}

export interface ChatMessageProps {
  sender: string
  content: string
  timestamp: string
}

export interface QuickActionCardProps {
  icon: "ship" | "chat" | "friend"
  title: string
  onClick: () => void
}

export interface AnnouncementCardProps {
  title: string
  content: string
  image?: string
}

export interface ProfileHeaderProps {
  avatarSrc?: string
  bio: string
  stats: { label: string; value: string | number }[]
  onBioChange: (bio: string) => void
}

export interface AchievementCardProps {
  label: string
  description: string
  isUnlocked: boolean
}

export interface MatchHistoryEntryProps {
  opponent: string
  outcome: "win" | "loss"
  onReplay: () => void
}

export interface TableRowProps {
  data: (string | number)[]
  isHighlighted?: boolean
}

export interface FilterDropdownProps {
  label: string
  options: string[]
  onSelect: (option: string) => void
}

export interface SidebarMenuProps {
  items: {
    label: string
    icon: "ship" | "chat" | "friend"
    onClick: () => void
    isActive?: boolean
  }[]
}

export interface ContentEditorFormProps {
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onSchedule: (date: string) => void
}

export interface ChartProps {
  data: { x: number; y: number; value: number }[]
  width?: number
  height?: number
}

// Organism Types
export interface GameBoardProps {
  yourGrid: GridState[][]
  opponentGrid: GridState[][]
  timer: number
  totalTime: number
  onCellClick: (row: number, col: number) => void
  onCellHover: (row: number, col: number) => void
}

export interface ChatPanelProps {
  messages: ChatMessageProps[]
  onSendMessage: (message: string) => void
}

export interface ActionBarProps {
  onRandomize: () => void
  onEndTurn: () => void
  onSurrender: () => void
  isSetupPhase: boolean
}

export interface QuickActionsSectionProps {
  actions: {
    icon: "ship" | "chat" | "friend"
    title: string
    onClick: () => void
  }[]
}

export interface AnnouncementsCarouselProps {
  announcements: { title: string; content: string; image?: string }[]
}

export interface StatsSectionProps {
  stats: { label: string; value: string | number }[]
}

export interface AchievementsGridProps {
  achievements: { label: string; description: string; isUnlocked: boolean }[]
}

export interface MatchHistoryListProps {
  matches: { opponent: string; outcome: "win" | "loss"; onReplay: () => void }[]
}

export interface FriendsListProps {
  friends: {
    username: string
    isOnline: boolean
    onMessage: () => void
    onInvite: () => void
    onSpectate: () => void
  }[]
}

export interface LeaderboardTableProps {
  rows: { rank: number; username: string; elo: number; winRate: string }[]
  highlightTop?: number
}

export interface FiltersSectionProps {
  onPeriodChange: (period: string) => void
  onRegionChange: (region: string) => void
}

export interface UserRankCardProps {
  rank: number
  username: string
  elo: number
  winRate: string
}

export interface SidebarProps {
  items: {
    label: string
    icon: "ship" | "chat" | "friend"
    onClick: () => void
    isActive?: boolean
  }[]
}

export interface ContentEditorSectionProps {
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onSchedule: (date: string) => void
}

export interface AnalyticsSectionProps {
  charts: { data: { x: number; y: number; value: number }[] }[]
  onExport: () => void
}

export interface UserManagementTableProps {
  users: {
    username: string
    status: string
    lastActive: string
    onBan: () => void
    onWarn: () => void
  }[]
}

// Template Types
export interface GameScreenTemplateProps {
  yourGrid: GridState[][]
  opponentGrid: GridState[][]
  timer: number
  totalTime: number
  chatMessages: ChatMessageProps[]
  onCellClick: (row: number, col: number) => void
  onCellHover: (row: number, col: number) => void
  onSendMessage: (message: string) => void
  onRandomize: () => void
  onEndTurn: () => void
  onSurrender: () => void
  isSetupPhase: boolean
}

export interface HomepageTemplateProps {
  onPlayClick: () => void
  actions: {
    icon: "ship" | "chat" | "friend"
    title: string
    onClick: () => void
  }[]
  announcements: { title: string; content: string; image?: string }[]
}

export interface ProfilePageTemplateProps {
  avatarSrc?: string
  bio: string
  stats: { label: string; value: string | number }[]
  achievements: { label: string; description: string; isUnlocked: boolean }[]
  matches: { opponent: string; outcome: "win" | "loss"; onReplay: () => void }[]
  friends: {
    username: string
    isOnline: boolean
    onMessage: () => void
    onInvite: () => void
    onSpectate: () => void
  }[]
  onBioChange: (bio: string) => void
}

export interface LeaderboardsPageTemplateProps {
  userRank: { rank: number; username: string; elo: number; winRate: string }
  leaderboardData: {
    rank: number
    username: string
    elo: number
    winRate: string
  }[]
  onPeriodChange: (period: string) => void
  onRegionChange: (region: string) => void
}

export interface CMSDashboardTemplateProps {
  sidebarItems: {
    label: string
    icon: "ship" | "chat" | "friend"
    onClick: () => void
    isActive?: boolean
  }[]
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onSchedule: (date: string) => void
  charts: { data: { x: number; y: number; value: number }[] }[]
  onExport: () => void
  users: {
    username: string
    status: string
    lastActive: string
    onBan: () => void
    onWarn: () => void
  }[]
}

export interface AuthTemplateProps {
  title: string
  email: string
  onEmailChange: (email: string) => void
  password: string
  onPasswordChange: (password: string) => void
  username?: string
  onUsernameChange?: (username: string) => void
  onSubmit: () => void
  onOAuth: (provider: "google" | "github") => void
  showForgotPassword?: boolean
}

export interface SettingsTemplateProps {
  theme: "light" | "dark" | "colorblind"
  onThemeChange: (theme: "light" | "dark" | "colorblind") => void
  fontSize: number
  onFontSizeChange: (fontSize: number) => void
  animationsEnabled: boolean
  onAnimationsChange: (enabled: boolean) => void
  onUpdateEmail: (email: string) => void
  onUpdatePassword: (password: string) => void
  onDeleteAccount: () => void
}

export interface FAQsTutorialsTemplateProps {
  content: { title: string; description: string; media?: string }[]
}

// Shared Game Types
export type GridState = "untouched" | "hit" | "miss" | "ship"
