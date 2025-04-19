import { useState } from "react";

import { useEffect } from "react";

export function useDebounce(value: string, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => setDebouncedValue(value), delay);

		return () => clearTimeout(timeout);
	}, [value, delay]);

	return debouncedValue;
}
