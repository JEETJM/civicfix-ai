export const USER_ROLES = {
  CITIZEN: "citizen",
  DEPARTMENT_OFFICER: "department_officer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

export const roleLabels = {
  [USER_ROLES.CITIZEN]: "Citizen",
  [USER_ROLES.DEPARTMENT_OFFICER]: "Department Officer",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.SUPER_ADMIN]: "Super Admin",
};

export const getDashboardPathByRole = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "/admin-dashboard";
    case USER_ROLES.SUPER_ADMIN:
      return "/super-admin-dashboard";
    case USER_ROLES.DEPARTMENT_OFFICER:
      return "/department-dashboard";
    case USER_ROLES.CITIZEN:
    default:
      return "/dashboard";
  }
};