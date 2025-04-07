import { SearchIcon } from "./icons/search";

export function InputSearch() {
	return (
		<div className="flex items-center gap-2 border border-gray-400 rounded-md shadow-sm bg-white w-[min(100%,500px)] h-12 focus-within:outline focus-within:outline-blue-500">
			<input
				type="text"
				placeholder="Rechercher un nom ou une activité..."
				className="w-full h-full placeholder:text-gray-400 placeholder:text-sm placeholder:font-light px-3 py-1 outline-none"
			/>
			<button
				type="button"
				className="px-3 py-2 h-full grid place-items-center rounded-e-sm bg-gray-800 text-white"
			>
				<SearchIcon className="w-7 h-7" />
			</button>
		</div>
	);
}
