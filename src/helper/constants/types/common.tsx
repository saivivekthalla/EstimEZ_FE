export interface MenuListInterface {
  title: string;
  icon: React.ReactNode;
  url: string;
  id: number | string;
  isDisabled?: boolean;
}

export interface verticalinterface {
  id: number;
  name: string;
}

export interface PracticesInterface {
  id: number;
  name: string;
}
export interface ProjectTypeInterface {
  id: number;
  name: string;
}

export interface EngagementTypeInterface {
  id: number,
  name: string;
}

export interface ProjectInterface {
  projectId?: number;
  projectName: string;
  description: string;
  verticalId: number | undefined;
  clientName: string;
  projectTypeIds: number[] | undefined;
  engagementTypeId: number | undefined;
  pursuitLead: string;
  estimationOwner: string;
  opportunityId: string;
  opportunityLink: string;
  practiceIds: number[] | undefined;
  estimation?: EstimationTemplate[];
  resourcePlanning?: ResourceInterface[];
  userId?: string;
  createdBy?: string;
  practices?: number[];
}

export interface EstimationTemplate {
  estimationId: number;
  estimationName: string;
  approaches: Approach[];
}

export interface MenuItem {
  id: number;
  title: string;
  icon?: JSX.Element;
  url: string;
  disableNav?: boolean;
  infoUrl?: string;
  pathUrl?: string;
  pathGraph?: string,
  pathSummary?: string
  submenu?: boolean
}

export interface WBSstrategy {
  name: string;
  description: string;
  projectId?: number;
  totalDuration?: number;
  updatedBy?: string;
  wbsStrategyId?: number;
}

export interface Approach {
  approachName: string;
  description: string;
  totalHours: number;
  chosen: boolean;
}

export interface discountData {
  discountId?: number | null;
  categoryId: number;
  description: string;
  percentage: number;
}

export interface ResourceInterface {
  wbsStrategyId: null;
  approachId?: number;
  approachName: string;
  description: string;
  totalCost?: number;
  createdBy?: string;
  updatedBy?: string;
  discovery?: ResourcePhaseInerface;
  conceive?: ResourcePhaseInerface;
  build?: ResourcePhaseInerface;
  projectId?: number;
}

export interface ResourcePhaseInerface {
  durationType: string;
  totalCost: number;
  totalTime: number;
  resourceCount: number;
  roles: RoleInterface[];
}

export interface RoleInterface {
  role: string;
  region: string;
  costPerHour: number;
  customCostPerHour: boolean;
  roleTotalTime: number;
  roleTotalCost: number;
  timeRanges: RangeInterface[];
}

export interface RangeInterface {
  startTime: string;
  endTime: string;
  hourPerRange: number;
  rangeCost: number;
}

export const numberFormat = "number";

export const roleList = [
  "Select Role",
  "Pursuit Manager",
  "Project Manager",
  "Lead Architect",
  "Project Lead",
  "Team Lead",
  "QA Lead",
  "Assistant Manager",
  "Senior Analyst",
  "Senior QA",
  "Analyst",
];

export const regionList = ["Select Region", "NA", "IN"];
