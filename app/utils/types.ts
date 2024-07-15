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
  department?: DepartmentInterface;
  otp?: string;
  staffId?: string;
  role?: string;
  position?: string;
  permissions?: string[];
  generalManager?: boolean;
  employeeStatus?: "active" | "inactive";
  contractor?: string;

  createdAt?: string;
};

export type UserRoleInterface = {
  id: string;
  name: string;
  display_name: string;
};

export type DepartmentInterface = {
  _id?: string;
  name: string;
  description: string;
  commandingOfficer: UserInterface;
  departmentSeargent: UserInterface;
  platoonCommander: UserInterface;
  administrationWarranty: UserInterface;
};
