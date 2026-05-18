import { createAccessControl } from "better-auth/plugins/access";

export const authAc = createAccessControl({
  company: [
    "create",
    "read-own",
    "update-own",
    "delete-own",
    "read-any",
    "update-any",
    "delete-any",
  ],
  adminDashboard: ["view"],
  user: ["read-any", "update-any", "set-role", "delete-any"],
} as const);

export const userRole = authAc.newRole({
  company: ["create", "read-own", "update-own", "delete-own"],
  adminDashboard: [],
  user: [],
});

export const adminRole = authAc.newRole({
  company: [
    "create",
    "read-own",
    "update-own",
    "delete-own",
    "read-any",
    "update-any",
    "delete-any",
  ],
  adminDashboard: ["view"],
  user: ["read-any", "update-any", "set-role", "delete-any"],
});

export const authRoles = {
  user: userRole,
  admin: adminRole,
};
