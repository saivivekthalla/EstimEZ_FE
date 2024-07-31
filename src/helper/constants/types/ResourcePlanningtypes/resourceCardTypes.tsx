export interface ResourceCard {
    approachName: string;
    description: string;
    wbs_strategy_id?: number | 0;
    totalCost: number | null;
}

export interface ResourceCardProps {
    data: ResourceCard;
    index: number;
    selectedItem: number | null;
    onClick: (index: number, name: string) => void;
}