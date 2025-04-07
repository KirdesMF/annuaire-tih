import type { EmailOtpType } from "@supabase/supabase-js";
import { json } from "@tanstack/react-start";

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getSupabaseServerClient } from "~/utils/supabase";

export const APIRoute = createAPIFileRoute("/api/confirm")({
	GET: async ({ request, params }) => {
		const url = new URL(request.url);
		const token_hash = url.searchParams.get("token_hash");
		const type = url.searchParams.get("type") as EmailOtpType;

		if (token_hash && type) {
			const supabase = getSupabaseServerClient();
			const { error } = await supabase.auth.verifyOtp({
				token_hash,
				type: type,
			});

			if (error) {
				return json({ error: error.message }, { status: 400 });
			}
		}

		const redirect = new URL("/account", request.url);
		return Response.redirect(redirect, 302);
	},
});
