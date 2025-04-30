import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import type { UserRole } from "~/db/schema/auth";
import type { CompanyStatus } from "~/db/schema/companies";
import { updateUserRoleFn } from "~/lib/api/admin/mutations/update-user-role";
import { deleteCompany } from "~/lib/api/companies/mutations/delete-company";
import { updateCompanyStatus } from "~/lib/api/companies/mutations/update-company-status";
import { companiesQuery } from "~/lib/api/companies/queries/get-companies";
import { usersQuery } from "~/lib/api/users/queries/get-users";
import { COMPANY_STATUSES } from "~/utils/constantes";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.prefetchQuery(companiesQuery()),
      context.queryClient.prefetchQuery(usersQuery),
    ]);
  },
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const { data: companies } = useSuspenseQuery(companiesQuery());
  const { data: users } = useSuspenseQuery(usersQuery);
  const { mutate: update } = useMutation({ mutationFn: useServerFn(updateCompanyStatus) });
  const { mutate: remove } = useMutation({ mutationFn: useServerFn(deleteCompany) });
  const { mutate: updateUserRole, isPending: isUpdatingUserRole } = useMutation({
    mutationFn: useServerFn(updateUserRoleFn),
  });

  // keep track of the current user being updated
  const currentUser = useRef("");
  const currentCompany = useRef("");

  // TODO: Add confirmation dialog
  function onAction(companyId: string, action: CompanyStatus) {
    currentCompany.current = companyId;
    update(
      { data: { companyId, status: action } },
      {
        onSuccess: () => {
          toast.success("Company status updated");
          context.queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
      },
    );
  }

  // TODO: Add confirmation dialog
  function onDeleteCompany(companyId: string, companySlug: string) {
    remove(
      { data: { companyId, companySlug } },
      {
        onSuccess: () => {
          toast.success("Company deleted");
          context.queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
      },
    );
  }

  function onUpdateUserRole(userId: string, role: UserRole) {
    currentUser.current = userId;
    updateUserRole(
      { data: { userId, role } },
      {
        onSuccess: () => {
          toast.success("User role updated");
          context.queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      },
    );
  }

  return (
    <main>
      <div className="container px-4 py-6 grid gap-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid gap-4">
          <h2 className="text-lg font-bold">Companies</h2>
          <div className="grid gap-4">
            {companies?.map((company) => (
              <div
                key={company.id}
                className="bg-card text-card-foreground shadow-md rounded-lg p-4"
              >
                <h2 className="text-lg font-bold">{company.name}</h2>
                <p className="text-sm text-card-foreground">{COMPANY_STATUSES[company.status]}</p>

                <div className="flex gap-2">
                  <button
                    name="action"
                    value="accept"
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={company.status === "active"}
                    onClick={() => onAction(company.id, "active")}
                  >
                    Accepter
                  </button>

                  <button
                    name="action"
                    value="reject"
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={company.status === "rejected"}
                    onClick={() => onAction(company.id, "rejected")}
                  >
                    Rejeter
                  </button>

                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={company.status === "pending"}
                    onClick={() => onAction(company.id, "pending")}
                  >
                    En attente
                  </button>
                </div>

                <button
                  type="button"
                  className="text-xs text-destructive border border-destructive px-2 py-1 rounded-sm transition-colors"
                  onClick={() => onDeleteCompany(company.id, company.slug)}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-lg font-bold">Users</h2>
          <div className="grid gap-4">
            {users?.map((user) => (
              <div key={user.id} className="bg-card text-card-foreground shadow-md rounded-lg p-4">
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{user.role}</p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs text-secondary-foreground border border-secondary-foreground px-2 py-1 rounded-sm hover:bg-secondary transition-colors"
                    onClick={() => onUpdateUserRole(user.id, "admin")}
                  >
                    {isUpdatingUserRole && currentUser.current === user.id && user.role === "user"
                      ? "Updating..."
                      : "Set as admin"}
                  </button>

                  <button
                    type="button"
                    className="text-xs text-secondary-foreground border border-secondary-foreground px-2 py-1 rounded-sm hover:bg-secondary transition-colors"
                    onClick={() => onUpdateUserRole(user.id, "user")}
                  >
                    {isUpdatingUserRole && currentUser.current === user.id && user.role === "admin"
                      ? "Updating..."
                      : "Set as user"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
