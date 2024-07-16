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
  staffId?: string;
  badgeNumber?: string;
  role?: string;
  position?: string;
  company?: CompanyInterface;
  contractor?: string;
};

export type UserRoleInterface = {
  id: string;
  name: string;
  display_name: string;
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
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "sngoing" | "sompleted" | "sancelled";
  notes: string;
};
