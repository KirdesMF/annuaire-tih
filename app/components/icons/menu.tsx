export function MenuIcon(props: React.ComponentPropsWithRef<"svg">) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Menu</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4 5h12M4 12h16M4 19h8"
        color="currentColor"
      />
    </svg>
  );
}
