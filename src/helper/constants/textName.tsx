export const InfoDashboardTexts = {
  welcomeMessage: "Good ",
  // aboutSectionTitle: "About Us",
  createEstimation: "Create Estimation",
  aboutSection: "Project Estimation, Resource Configuration and consolidating the results starts here",
  name: "Admin",
  // contactSectionTitle: "Contact Us",
  // Add more static text as needed
};

export const dashboardTexts = {
  appTitle: "Estimation Tool",
  appDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  utilityTabDescription: "List of Utilities Applications will be displayed here.",
  recentTabDescription: "List of recently used Applications will be displayed here.",
  appTabTitle: "Enterprise",
  utilityTabTitle: "Utilities",
  recentTabTitle: "Recently used",
  dashboardTitle: "App Dashboard"
}

export const textCreateInfo = {
  projectNameLabel: "Name",
  descriptionLabel: "Description",
  verticalLabel: "Vertical",
  accountNameLabel: "Account Name",
  projectTypeLabel: "Project Type",
  engagementTypeLabel: "Engagement Type",
  pursuitLeadLabel: "Pursuit Lead",
  estimationOwnerLabel: "Estimation Owner",
  opportunityIdLabel: "Opportunity ID",
  opportunityLinkLabel: "Opportunity Link",
  practicesLabel: "Practices",
  createButtonLabel: "Create",
  SelectVerticalLabel: "Select a Vertical",
};

export const textCreateInfoFieldIds = {
  projectName: "projectName",
  description: "description",
  clientName: "clientName",
  engagementType: "engagementType",
  projectType: "projectType",
  pursuitLead: "pursuitLead",
  estimationOwner: "estimationOwner",
  opportunityID: "opportunityId",
  opportunityLink: "opportunityLink",
  verticalId: "verticals",
};


export const formFields = [
  {
    id: "nameL",
    label: textCreateInfo.projectNameLabel,
    type: "text",
    placeholder: "Enter Name",
    variant: "outlined",
    name: textCreateInfoFieldIds.projectName,
    required: true,
  },
  {
    id: "descriptionL",
    label: textCreateInfo.descriptionLabel,
    type: "text",
    placeholder: "Enter Description",
    variant: "outlined",
    name: textCreateInfoFieldIds.description,
    required: true,
  },
  {
    id: "vertical",
    label: textCreateInfo.verticalLabel,
    select: true,
    name: textCreateInfoFieldIds.verticalId,
    required: true,
    
  },
  {
    id: "accountNameL",
    label: textCreateInfo.accountNameLabel,
    type: "text",
    placeholder: "Enter Account Name",
    variant: "outlined",
    name: textCreateInfoFieldIds.clientName,
    required: true,
  },
  {
    id: "projectTypeL",
    label: textCreateInfo.projectTypeLabel,
    autocomplete: true,
    name: "projectType",
  
  },
  {
    id: "engagementType",
    label: textCreateInfo.engagementTypeLabel,
    select: true,
    name: textCreateInfoFieldIds.engagementType,
    required: true,
    
  },
  {
    id: "pursuitLeadL",
    label: textCreateInfo.pursuitLeadLabel,
    type: "text",
    placeholder: "Enter Pursuit Lead",
    variant: "outlined",
    name: textCreateInfoFieldIds.pursuitLead,
    required: true,
  },
  {
    id: "estimationOwnerL",
    label: textCreateInfo.estimationOwnerLabel,
    type: "text",
    placeholder: "Enter Estimation Owner",
    variant: "outlined",
    name: textCreateInfoFieldIds.estimationOwner,
  },
  {
    id: "oppurtunityIdL",
    label: textCreateInfo.opportunityIdLabel,
    type: "text",
    placeholder: "Enter Opportunity ID",
    variant: "outlined",
    name: textCreateInfoFieldIds.opportunityID,
    required: true,
  },
  {
    id: "oppurtunityLinkL",
    label: textCreateInfo.opportunityLinkLabel,
    type: "url",
    placeholder: "Enter Opportunity Link",
    variant: "outlined",
    name: textCreateInfoFieldIds.opportunityLink,
    required: true,
  },
  {
    id: "practiceL",
    label: textCreateInfo.practicesLabel,
    autocomplete: true,
    name: "practices",
  
  },
];

export const estimationText = {
  newApproach: "New Approach",
  estimationSummary: "Estimation Summary",
  estimatedHours: "estimatedHours",
  description: "Enter the Description",
  totalDuration: "Total Duration",
  hours: "Hours",
  estimatedHour: "Estimated Hours",
  selectOption: "Select an option",
};

export const resourceText = {
  new: "new",
  updating: "updating",
  approachName: "approachName",
  wbsStrategyId: "wbsStrategyId",
  description: "description",
  discover: "Discover",
  conceive: "Conceive",
  build: "Build",
  resourceCount: "Resource Count",
  totalTime: "Total Time",
  confirmText: "If you have unsaved changes, please save them before switching the other tabs!",
  resourcePlanning: "Resource Planning",
};

export const resourceCalender = {
  startName: "start",
  startId: "startDate",
  endName: "end",
  endId: "rangeEndSelect",
  hourName: "hourPerDuration",
  hourId: "perHourInput",
  month: "Month",
  week: "Week",
  hourWeek: "Hour/Week",
  totalWeeks: "Total Weeks",
  totalCost: "Total Cost",
  endWeek: "End Week",
  hourMonth: "Hour/Months",
  totalMonths: "Total Months",
  endMonth: "End Month",
  createRange: "Create Range",
  roles: "roles",
};

export const discoverId = {
  role: "role",
  region: "region",
  hour: "hour",
  totalTime: "totalTime",
  cost: "cost",
  roles: "roles",
};

export const discoverLabel = {
  role: "Role",
  region: "Region",
  hour: "Cost/hr",
  totalTimeWeek: "Weekly",
  totalTimeMonth: "Months",
  cost: "Cost",
  selectRegion: "Select a Region",
  costPerHr: "Cost Per Hour",
  roles: "Roles",
  regions: "Regions",
  costPerHour: "costPerHour",
};

export const alertText = {
  saveSuccess: "Saved Successfully",
  saveFailed: "Save Failed",
  uniqueApproachName: " already exists. Please enter a unique Approach Name",
  noChanges: "No changes detected. Nothing new to save.",
  uniqueStrategy: " already exists. Please enter a unique Strategy Name.",
  pleaseFill: "Please fill out the fields",
  deleteAllApproaches: "Are you sure to delete all Approaches?",
  cancel: "Cancel",
  confirm: "Confirm",
  deleteAll: "Delete All",
  deleteSuccess: "Delete Success",
  deleteFailed: "Delete Failed",
  errorOccurred: "Error Occurred",
};



