export type RewardType = 'gems' | 'xp' | 'key' | 'trophy_mission';

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ChestState = 'closed' | 'rumbling' | 'burst' | 'revealing' | 'completed';

export interface ChestRewardItem {
  id: string;
  type: RewardType;
  title: string;
  amount: number;
  description: string;
  rarity: RewardRarity;
  icon: string;
  color: string;
}

export interface ChestRewardSummary {
  totalXp: number;
  totalGems: number;
  keysAwarded: number;
  unlockedMissionTitle?: string;
  unlockedTrophyTitle?: string;
}

export interface UnitChestInfo {
  unitId: string;
  unitTitle: string;
  isCompleted: boolean;
  isOpened: boolean;
}
