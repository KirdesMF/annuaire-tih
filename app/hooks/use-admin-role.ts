import { isValidRole } from "~/db/schema/auth";
import { authClient } from "~/lib/auth/auth.client";

export function useAdminRole() {
  const { data: session } = authClient.useSession();
  const role = session?.user.role;
  const isValid = isValidRole(role);
  const isAdmin = isValid && (role === "admin" || role === "superadmin");

  return {
    isAdmin,
  };
}
