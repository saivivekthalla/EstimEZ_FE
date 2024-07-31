// Interface for the 'createProject' section
export interface CreateProject {
    verticalData: [];
    engagementType: [];
    selectedState: string;
    status: string;
    message: string;
    loading: boolean;
    isSuccess: boolean;
    hasError: boolean;
    project: Project;
    practices: Practice[];
    projectType: ProjectType[];
  }
  
  // Interface for the 'project' property within 'createProject'
  export interface Project {
    projectId: number;
    projectName: string;
    description: string;
    totalDiscount: number;
    totalOtherCost: number;
    vertical: Vertical;
    clientName: string;
    pursuitLead: string;
    estimationOwner: string;
    opportunityLink: string;
    practices: Practice[];
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    resourcePlanning: ResourcePlanning[];
    wbsStrategies: any[]; // Define the proper type for 'wbsStrategies' when available
    opportunityId: string;
    projectTypes: ProjectType[];
    engagementType: EngagementType;
    projectFinalizedRecord: ProjectFinalizedRecord;
  }
  
  // Interface for the 'vertical' property within 'project'
  export interface Vertical {
    id: number;
    name: string;
  }
  
  // Interface for the 'practice' property within 'project'
  export interface Practice {
    id: number;
    name: string;
  }
  
  // Interface for the 'resourcePlanning' property within 'project'
  export interface ResourcePlanning {
    approachId: number;
    approachName: string;
    description: string;
    wbs_strategy_id: number | null;
    version: number | null;
    totalCost: number | null;
    proposedCost: number | null;
    totalCtcCost: number;
    discountAmount: number | null;
    marginCost: number | null;
    marginPercentage: number | null;
    discover: PlanningPhase;
    conceive: PlanningPhase;
    build: PlanningPhase;
    createdBy: string;
    updatedBy: string | null;
  }
  
  // Interface for the 'discover', 'conceive', and 'build' properties within 'resourcePlanning'
  export interface PlanningPhase {
    totalDuration: number | null;
    totalCost: number | null;
    resourceCount: number | null;
    durationType: string | null;
    roles: any[]; // Define the proper type for 'roles' when available
  }
  
  // Interface for the 'engagementType' property within 'project'
  export interface EngagementType {
    id: number;
    name: string;
  }
  
  // Interface for the 'projectFinalizedRecord' property within 'project'
  interface ProjectFinalizedRecord {
    selectedApproach: SelectedApproach;
    previousSelectedApproaches: PreviousSelectedApproach[];
  }
  
  // Interface for the 'selectedApproach' property within 'projectFinalizedRecord'
  interface SelectedApproach {
    approachId: number;
    totalDuration: number;
    totalCost: number;
    spr: number;
    userName: string;
    dateTime: string;
    differenceHours: number | null;
  }
  
  // Interface for the 'previousSelectedApproach' property within 'projectFinalizedRecord'
  export interface PreviousSelectedApproach {
    approachId: number;
    userName: string;
    dateTime: string;
  }
  
  // Interface for the 'projectType' property within 'createProject'
  export interface ProjectType {
    id: number;
    name: string;
  }
  
  // Interface for the 'estimationSummary' section
  export interface EstimationSummary {
    estimationTask: any[]; // Define the proper type for 'estimationTask' when available
    estimationSubTask: any[]; // Define the proper type for 'estimationSubTask' when available
    summaryCalculation: any[]; // Define the proper type for 'summaryCalculation' when available
    showSubTasks: boolean;
    showEstimatedHours: boolean;
    estimationCalc: any[]; // Define the proper type for 'estimationCalc' when available
    status: boolean;
    error: null | string;
    currentTaskId: number;
    currenSubTaskId: number;
    currentTemplate: any; // Define the proper type for 'currentTemplate' when available
    currentComponent: any; // Define the proper type for 'currentComponent' when available
    enableTextBox: boolean;
  }
  
  // Interface for the 'estimationForm' section
  interface EstimationForm {
    id: number;
    inputValue: string;
    selectedOption: string;
  }
  
  // Interface for the 'projects' section
  export interface Projects {
    projects: any[]; // Define the proper type for 'projects' when available
    status: boolean;
    error: null | string;
  }
  
  // Interface for the 'resource' section
  export interface Resource {
    roles: any[]; // Define the proper type for 'roles' when available
    regions: any[]; // Define the proper type for 'regions' when available
    rateCards: any[]; // Define the proper type for 'rateCards' when available
    discoverDurationType: string;
    conceiveDurationType: string;
    buildDurationType: string;
    status: boolean;
    error: null | string;
    currentPhase: string;
    currentYear: number;
  }
  
  // Interface for the 'summary' section
  export interface Summary {
    activeApproachIndex: number;
    selectedWbsStrategy: SelectedWbsStrategy;
    finalized: boolean;
    clicked: boolean;
    projectId: number;
    finalizedApproach: ProjectFinalizedRecord;
    wbsStrategies: any[]; // Define the proper type for 'wbsStrategies' when available
    status: boolean;
  }
  
  // Interface for the 'selectedWbsStrategy' property within 'summary'
  export interface SelectedWbsStrategy {
    id: number;
    strategyName: string;
    description: string;
    estimations: Estimation[];
    totalStrategyHours: number;
  }
  
  // Interface for the 'estimations' property within 'selectedWbsStrategy'
  export interface Estimation {
    templateId: number;
    practiceRecord: Practice;
    taskDetails: any; // Define the proper type for 'taskDetails' when available
    totalEstimationHours: number;
    components: Components;
  }
  
  // Interface for the 'components' property within 'estimations'
  export interface Components {
    simple: number;
    medium: number;
    complex: number;
  }
  
  // Interface for the 'wbs' section
  export interface Wbs {
    status: boolean;
    error: string;
  }
  
  // Interface for the 'dealDesk' section
  export interface DealDesk {
    statusline: boolean;
    statusdonut: boolean;
    statusmonthly: boolean;
    lineChartData: any[]; // Define the proper type for 'lineChartData' when available
    donutChartData: any[]; // Define the proper type for 'donutChartData' when available
    rrrrData: any[]; // Define the proper type for 'rrrrData' when available
    monthlyInvoiceData: any; // Define the proper type for 'monthlyInvoiceData' when available
    error: null | string;
  }
  
  // Interface for the 'effortDistribution' section
  export interface EffortDistribution {
    effortDistributionData: EffortDistributionItem[];
  }
  
  // Interface for each item in 'effortDistributionData'
  export interface EffortDistributionItem {
    category: string;
    count: number;
    percentage: number;
    totalCost: number;
    totalTime: number;
  }
  
  // Interface for the 'dealDeskRole' section
  export interface DealDeskRole {
    projectId: number;
    statusrole: boolean;
    roleRedundantData: any[]; // Define the proper type for 'roleRedundantData' when available
    error: null | string;
  }

  export interface DealDeskFractional {
    projectId: number;
    statusrole: boolean;
    fractionalAllocationData: any[];
    error: null | string;
  }
  
  // Combining all the interfaces into a single RootState interface
  export interface RootState {
    createProject: CreateProject;
    estimationSummary: EstimationSummary;
    estimationForm: EstimationForm[];
    projects: Projects;
    resource: Resource;
    summary: Summary;
    wbs: Wbs;
    dealDesk: DealDesk;
    effortDistribution: EffortDistribution;
    dealDeskRole: DealDeskRole;
    dealDeskFractional : DealDeskFractional;
  }
  
  