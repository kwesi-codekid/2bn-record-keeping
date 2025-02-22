export type AdminNavLinkInterface = {
  path: string;
  icon: JSX.Element;
  label: string;
};

export type SelectItemInterface = {
  key: string;
  value: string;
  display_name: string;
};
export type SelectItemsInterface = SelectItemInterface[];

export type UserInterface = {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  dateOfBirth?: string;
  department?: string;
  badgeNumber?: string;
  role?: string;
  position?: string;
  company?: CompanyInterface;
  lastPromotionDate?: Date;
};

export type DepartmentInterface = {
  _id?: string;
  name: string;
  description: string;
  strength: string;
  mission: string;
  vission: string;
  quote: string;
  tacticOfficer: UserInterface;
  trainingOfficer: UserInterface;
};

export type UserRoleInterface = {
  id: string;
  name: string;
  display_name: string;
};

export type GroupInterface = {
  _id?: string;
  name: string;
  description: string;
  inCharge: UserInterface;
  members: UserInterface;
};
export type CompanyInterface = {
  _id?: string;
  name: string;
  description: string;
  commandingOfficer: UserInterface;
  companySeargent: UserInterface;
  platoonCommander: UserInterface;
  administrationWarranty: UserInterface;
};

export type DutyInterface = {
  _id?: string;
  officer: UserInterface;
  dutyType:
  | "patrol"
  | "traffic"
  | "investigation"
  | "community service"
  | "administrative";
  dutyLocation: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "sngoing" | "sompleted" | "sancelled";
  notes: string;
  inCharge: string;
};

export type MissionInterface = {
  name: string;
  description: string;
  missionType:
    | "patrol"
    | "traffic"
    | "investigation"
    | "community service"
    | "administrative";
  missionLocation: string;
  startDate: string;
  endDate: string;
  status: "scheduled" | "sngoing" | "sompleted" | "sancelled";
};
