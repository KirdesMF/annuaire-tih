import { describe, expect, test } from "bun:test";
import { createAccountContactsCsv } from "./csv";

describe("account contacts CSV", () => {
  test("exports only name and email with UTF-8 and spreadsheet-friendly line endings", () => {
    const accounts = [
      { name: "Élodie Martin", email: "elodie@example.test", role: "admin", id: "private-id" },
    ];

    expect(createAccountContactsCsv(accounts)).toBe(
      '\uFEFF"Nom","Email"\r\n"Élodie Martin","elodie@example.test"\r\n',
    );
  });

  test("quotes commas, double quotes, and embedded newlines", () => {
    expect(
      createAccountContactsCsv([{ name: 'Jean, "Paul"\nDupont', email: "jp@example.test" }]),
    ).toBe('\uFEFF"Nom","Email"\r\n"Jean, ""Paul""\nDupont","jp@example.test"\r\n');
  });

  test("exports headers for an empty directory", () => {
    expect(createAccountContactsCsv([])).toBe('\uFEFF"Nom","Email"\r\n');
  });

  test("neutralizes spreadsheet formulas in both columns, including leading whitespace", () => {
    for (const value of [
      "=1+1",
      "+1+1",
      "-1+1",
      "@SUM(A1)",
      "  =1+1",
      "\t=1+1",
      "\r=1+1",
      "\n=1+1",
    ]) {
      const csv = createAccountContactsCsv([{ name: value, email: value }]);
      expect(csv).toBe(`\uFEFF"Nom","Email"\r\n"'${value}","'${value}"\r\n`);
    }
  });
});
