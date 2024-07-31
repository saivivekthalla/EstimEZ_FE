export interface InitialRangeState {
    start: string;
    end: string;
    hourPerDuration: number;
    rangeCost: number;
    allocationPercentage: number;
    fractionalWeekHours: {
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
        sunday: number;
    };
    startMonthRange: number;
    endMonthRange: number;
    hourPerDay: number;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface approach{
    approachId: number,
    approachName: string,
    description : string,
    wbs_strategy_id: number,
    build: phase,
    conceive: phase,
    discover: phase,
    discountAmount: number,
    finalAmountWithDiscount: number,
    marginCost: number,
    marginPercentage: number,
    proposedCost: number,
    totalAmountWithoutDiscount: number,
    totalCost: number,
    totalCtcCost: number,
    version: string | null,
    createdBy: string,
    updatedBy: string
}

export interface phase{
    durationType: string,
    resourceCount: string,
    roles:[] |null,
    totalCost: number | null,
    totalDuration: number | null
}


export interface Role {
    roleId?: number,
    roleLookupId: number | null,
    regionId: number | null,
    originalCost: number | null,
    costPerHour: number | null,
    isCustomCost: boolean,
    isFractionalAllocation: boolean,
    timeRanges: [],
    roleTotalCost: number | null,
    roleTotalTime: number | null
}