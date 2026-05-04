const USER_ROLES = {
  CITIZEN: "citizen",
  DEPARTMENT_OFFICER: "department_officer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

const ALL_ROLES = [
  USER_ROLES.CITIZEN,
  USER_ROLES.DEPARTMENT_OFFICER,
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER_ADMIN,
];

module.exports = {
  USER_ROLES,
  ALL_ROLES,
};