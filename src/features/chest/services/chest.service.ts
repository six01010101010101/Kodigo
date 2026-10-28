import { ChestRewardItem, ChestRewardSummary } from '../types/chest.types';

const STORAGE_KEY = 'kodigo_opened_chests';

class ChestService {
  private getOpenedChestIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  isChestOpened(unitId: string): boolean {
    return this.getOpenedChestIds().includes(unitId);
  }

  markChestOpened(unitId: string): void {
    const ids = this.getOpenedChestIds();
    if (!ids.includes(unitId)) {
      ids.push(unitId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  }

  generateUnitRewards(unitId: string, unitTitle: string): ChestRewardItem[] {
    // Deterministic seed based on unitId for consistent yet exciting rewards
    const hash = unitId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const gemBonus = 80 + (hash % 70);
    const xpBonus = 200 + (hash % 150);

    return [
      {
        id: `r_gems_${unitId}`,
        type: 'gems',
        title: 'Gemas de Código',
        amount: gemBonus,
        description: 'Moedas valiosas para vidas infinitas e itens na loja.',
        rarity: 'rare',
        icon: '💎',
        color: 'from-blue-500 to-cyan-400'
      },
      {
        id: `r_xp_${unitId}`,
        type: 'xp',
        title: 'Super Carga de XP',
        amount: xpBonus,
        description: 'Acelere seu avanço na liga e suba no ranking global.',
        rarity: 'epic',
        icon: '⚡',
        color: 'from-amber-400 to-yellow-500'
      },
      {
        id: `r_key_${unitId}`,
        type: 'key',
        title: 'Chave de Missão Especial',
        amount: 1,
        description: 'Desbloqueia desafios secretos valendo muito mais XP!',
        rarity: 'epic',
        icon: '🔑',
        color: 'from-emerald-400 to-green-600'
      },
      {
        id: `r_trophy_${unitId}`,
        type: 'trophy_mission',
        title: `Missão: Desafio ${unitTitle}`,
        amount: 500,
        description: 'Uma missão lendária com troféu exclusivo para seu perfil.',
        rarity: 'legendary',
        icon: '🏆',
        color: 'from-purple-500 to-pink-500'
      }
    ];
  }

  summarizeRewards(rewards: ChestRewardItem[]): ChestRewardSummary {
    let totalXp = 0;
    let totalGems = 0;
    let keysAwarded = 0;
    let unlockedMissionTitle: string | undefined;
    let unlockedTrophyTitle: string | undefined;

    for (const r of rewards) {
      if (r.type === 'xp') totalXp += r.amount;
      if (r.type === 'gems') totalGems += r.amount;
      if (r.type === 'key') keysAwarded += r.amount;
      if (r.type === 'trophy_mission') {
        unlockedMissionTitle = r.title;
        unlockedTrophyTitle = `Troféu: ${r.title.replace('Missão: ', '')}`;
      }
    }

    return { totalXp, totalGems, keysAwarded, unlockedMissionTitle, unlockedTrophyTitle };
  }
}

export const chestService = new ChestService();
