import type { EmailOtpType } from "@supabase/supabase-js";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/utils/supabase";

export const Route = createFileRoute("/_protected/account")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_protected/account"!</div>;
}
