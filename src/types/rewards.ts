export type RewardType = 'BADGE' | 'PROMO' | 'BONUS';

export interface Reward {
    id: string;
    type: RewardType;
    label: string;
    description: string;
    icon: string; // Lucide icon name or image path
    code?: string; // For PROMO type
}

export interface PlayerProgress {
    totalMatches: number;
    totalWins: number;
    rewards: Reward[];
}
