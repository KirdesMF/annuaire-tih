import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Separator } from "radix-ui";
import { PlusIcon } from "~/components/icons/plus";

export const Route = createFileRoute("/_protected/_compte")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-[calc(100svh-45px)]">
      <aside className="sticky inset-y-0 border-e border-gray-200 px-1 py-2">
        <nav>
          <ul className="flex flex-col gap-2">
            <li className="flex flex-col gap-1">
              <Link
                to="/compte/entreprises"
                className="text-sm font-light flex ps-4 pe-8 py-1.5 select-none text-gray-500 hover:text-gray-900 transition-colors"
              >
                Mes entreprises
              </Link>

              <ul className="ms-4">
                <li>
                  <Link
                    to="/compte/entreprises/add"
                    className="text-xs font-light flex items-center gap-1 px-4 py-1.5 text-gray-500 hover:text-gray-900"
                  >
                    <PlusIcon className="size-3" />
                    Référencer
                  </Link>
                </li>
              </ul>
            </li>

            <Separator.Root
              orientation="horizontal"
              decorative
              className="h-px bg-gray-200 -mx-1"
            />

            <li>
              <Link
                to="/compte/preferences"
                className="text-sm font-light flex ps-4 pe-8 py-1.5 select-none text-gray-500 hover:text-gray-900"
              >
                Preférences
              </Link>
            </li>

            <Separator.Root
              orientation="horizontal"
              decorative
              className="h-px bg-gray-200 -mx-1"
            />
          </ul>
        </nav>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
