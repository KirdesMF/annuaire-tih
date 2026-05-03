import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { isValidRole, type UserRole } from "~/db/schema/auth";
import { companiesTable } from "~/db/schema/companies";
import { auth, type AuthUser } from "~/lib/auth/auth.server";

export type AuthorizedUser = AuthUser & { id: string; role?: UserRole };

export function isAdminRole(role?: string | null): role is "admin" | "superadmin" {
  return isValidRole(role) && (role === "admin" || role === "superadmin");
}

export async function getCurrentUser(): Promise<AuthorizedUser | null> {
  const session = await auth().api.getSession({ headers: getRequestHeaders() });
  return session?.user ? (session.user as AuthorizedUser) : null;
}

export async function requireCurrentUser(): Promise<AuthorizedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié");
  }

  return user;
}

export async function requireAdminUser(): Promise<AuthorizedUser> {
  const user = await requireCurrentUser();

  if (!isAdminRole(user.role)) {
    throw new Error("Accès non autorisé");
  }

  return user;
}

export async function requireCompanyManager(companyId: string): Promise<AuthorizedUser> {
  const user = await requireCurrentUser();
  const [company] = await getDb()
    .select({ id: companiesTable.id, userId: companiesTable.user_id })
    .from(companiesTable)
    .where(eq(companiesTable.id, companyId));

  if (!company) {
    throw new Error("Entreprise introuvable");
  }

  if (company.userId !== user.id && !isAdminRole(user.role)) {
    throw new Error("Accès non autorisé");
  }

  return user;
}

export function assertSelfOrAdmin(targetUserId: string, user: AuthorizedUser): void {
  if (targetUserId !== user.id && !isAdminRole(user.role)) {
    throw new Error("Accès non autorisé");
  }
}
