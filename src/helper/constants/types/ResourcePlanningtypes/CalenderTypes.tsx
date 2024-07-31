export interface ToggleProps {
    isChecked: any;
    toggleSwitch: () => void;
}

export interface CustomComponentProps {
    durationType: string;
    MonthOrWeek: any;
    roleTimeRange: any;
    dateMatrix: any[];
    yearOptions: any;
}

export interface ConfigurationModalProps {
    open: boolean;
    handleClose: () => void;
    durationType: string;
    calendarProps1: any;
    onChildDataChange: any;
    resourcePlann: any;
    currentPhase: any;
    existingDatas: any;
    selectedRole: any;
    getLatestData: any;
}

export interface HeaderProps {
    calendarProps: any;
    durationType: string;
}

export interface ButtonGroupProps {
    enableSave: boolean;
    onChildDataChange: (roleTimeRange: any, index: number) => void;
    roleTimeRange: any;
    props: any;
    calendarProps: any;
}

export interface YearSelectorProps {
    yearOptions: {
        previousYear: number;
        currentYear: number;
        nextYear: number;
    };
    changeYear: (year: number) => void;
}

export interface calendarProps {
    open: boolean;
    resourceActivePhase?: string;
    durationType: string;
    saveSelectedRangeChanges?: any;
    handleClose?: any;
    calendarProps1?: any;
    onChildDataChange?: any;
    resourcePlann: any;
    currentPhase: any;
    existingDatas: any;
    selectedRole: any;
    getLatestData: any;
}

export interface WeekValue {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    [key: string]: string;
  };