type AccountContact = { name: string; email: string };

function escapeCsvCell(value: string) {
  // Quoting alone does not stop spreadsheet applications from evaluating formulas.
  const safeValue = /^[\s\uFEFF]*[=+@-]|^[\t\r\n]/u.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function createAccountContactsCsv(accounts: ReadonlyArray<AccountContact>) {
  const rows = [["Nom", "Email"], ...accounts.map(({ name, email }) => [name, email])];

  // UTF-8 BOM preserves accented names when opening the file in Excel.
  return `\uFEFF${rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")}\r\n`;
}
