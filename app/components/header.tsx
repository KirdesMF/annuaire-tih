import { Link } from "@tanstack/react-router";
import { LinkedinIcon } from "./icons/linkedin";

const LINKS = [
	{ label: "Qui sommes-nous ?", to: "/about" },
	{ label: "FAQ", to: "/faq" },
	{ label: "Sources", to: "/sources" },
	{ label: "Contact", to: "/contact" },
] as const;

export function Header() {
	return (
		<header className="px-4 py-4 flex items-center justify-between border-b border-gray-400 backdrop-blur-sm">
			<Link to="/">Annuaire TIH</Link>

			<nav>
				<ul className="flex items-center gap-4">
					{LINKS.map((link) => (
						<li key={link.to}>
							<Link
								to={link.to}
								className="text-sm font-light"
								activeProps={{ className: "text-blue-700" }}
							>
								{link.label}
							</Link>
						</li>
					))}
					<Link to="/signup" className="text-xs px-3 py-2 rounded-sm border border-gray-400">
						Se référencer
					</Link>
				</ul>
			</nav>

			<a
				href="https://linkedin.com/groups/13011531"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-blue-700 transition-colors"
			>
				<LinkedinIcon />
			</a>
		</header>
	);
}
