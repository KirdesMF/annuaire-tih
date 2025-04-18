import { SearchIcon } from "./icons/search";

export function InputSearch(props: React.ComponentPropsWithRef<"input">) {
	return (
		<div className="flex items-center gap-2 border border-gray-400 rounded-md shadow-sm bg-white w-full h-12 focus-within:outline focus-within:outline-blue-500">
			<input
				type="text"
				placeholder="Rechercher un nom ou une activité..."
				className="w-full h-full placeholder:text-gray-400 placeholder:text-sm placeholder:font-light px-3 py-1 outline-none"
				{...props}
			/>
		</div>
	);
}
