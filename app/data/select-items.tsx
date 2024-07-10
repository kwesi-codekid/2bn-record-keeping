export const roles = [
  { key: "admin", value: "admin", display_name: "Admin" },
  { key: "staff", value: "staff", display_name: "Staff" },
  { key: "supervisor", value: "supervisor", display_name: "Supervisor" },
  { key: "manager", value: "manager", display_name: "Manager" },
  {
    key: "general-manager",
    value: "general-manager",
    display_name: "General Manager",
  },
  {
    key: "nurse",
    value: "nurse",
    display_name: "Nurse",
  },
  {
    key: "doctor",
    value: "doctor",
    display_name: "Doctor",
  },
  {
    key: "lab-technician",
    value: "lab-technician",
    display_name: "Lab Technician",
  },
];

export const permissions = [
  {
    value: "request_for_others",
    name: "Request for others",
    description: "Make medical request on behalf of others",
  },
  {
    value: "approve_request",
    name: "Approve request",
    description: "Approve medical request",
  },
];

export const diagnosis = [
  { key: "NHIL", value: "NHIL", display_name: "NHIL" },
  { key: "COA", value: "COA", display_name: "COA" },
  { key: "STDs", value: "STDs", display_name: "STDs" },
  { key: "RTI", value: "RTI", display_name: "RTI" },
  { key: "MALARIA", value: "MALARIA", display_name: "MALARIA" },
  { key: "HPTN", value: "HPTN", display_name: "HPTN" },
  { key: "SKIN_DIX", value: "SKIN_DIX", display_name: "SKIN DIX" },
  { key: "RTA", value: "RTA", display_name: "RTA" },
  { key: "HIV", value: "HIV", display_name: "HIV" },
  { key: "DM", value: "DM", display_name: "DM" },
  { key: "MSD", value: "MSD", display_name: "MSD" },
  { key: "MSD_WR", value: "MSD_WR", display_name: "MSD (WR)" },
  { key: "UTI", value: "UTI", display_name: "UTI" },
  { key: "LB", value: "LB", display_name: "LB" },
  { key: "MN", value: "MN", display_name: "MN" },
  { key: "VIWF", value: "VIWF", display_name: "VIWF" },
  { key: "PNEU", value: "PNEU", display_name: "PNEU" },
  { key: "Others", value: "Others", display_name: "Others" },
];

export const workStatus = [
  { key: "fit-to-work", value: "fit-to-work", display_name: "Fit to work" },
  { key: "light-duty", value: "light-duty", display_name: "Light Duty" },
  { key: "excuse-duty", value: "excuse-duty", display_name: "Excuse Duty" },
];

export const labTests = [
  { key: "SICKLING", value: "SICKLING", display_name: "Sickling" },
  { key: "FBC", value: "FBC", display_name: "FBC" },
  {
    key: "GLYCATED HAEMOGLOBIN",
    value: "GLYCATED HAEMOGLOBIN",
    display_name: "Glycated Haemoglobin",
  },
  { key: "RBS", value: "RBS", display_name: "RBS" },
  { key: "FBS", value: "FBS", display_name: "FBS" },
  {
    key: "HEPATITIS BsAG",
    value: "HEPATITIS BsAG",
    display_name: "Hepatitis BsAG",
  },
  {
    key: "HEPATITIS C SCREEN",
    value: "HEPATITIS C SCREEN",
    display_name: "Hepatitis C Screen",
  },
  { key: "HIV 1+2", value: "HIV 1+2", display_name: "HIV 1+2" },
  { key: "URINE RE", value: "URINE RE", display_name: "Urine RE" },
  { key: "STOOL RE", value: "STOOL RE", display_name: "Stool RE" },
  { key: "LFTs", value: "LFTs", display_name: "LFTs" },
  { key: "SKIN SNIP", value: "SKIN SNIP", display_name: "Skin Snip" },
  {
    key: "BUE/CREATININE",
    value: "BUE/CREATININE",
    display_name: "BUE/CREATININE",
  },
  { key: "URIC ACID", value: "URIC ACID", display_name: "Uric Acid" },
  { key: "BF for MPs", value: "BF for MPs", display_name: "BF for MPs" },
  {
    key: "PREGNANCY TEST",
    value: "PREGNANCY TEST",
    display_name: "Pregnancy Test",
  },
  {
    key: "HIGH VAGINAL SWAB C/S",
    value: "HIGH VAGINAL SWAB C/S",
    display_name: "High Vaginal Swab C/S",
  },
  {
    key: "STOOL FOR H. PYLORI",
    value: "STOOL FOR H. PYLORI",
    display_name: "Stool for H. Pylori",
  },
  {
    key: "LIPID PROFILE",
    value: "LIPID PROFILE",
    display_name: "Lipid Profile",
  },
  { key: "TYPHIDOT", value: "TYPHIDOT", display_name: "Typhidot" },
  { key: "PSA", value: "PSA", display_name: "PSA" },
  { key: "OTHER TESTS", value: "OTHER TESTS", display_name: "Other Tests" },
];
