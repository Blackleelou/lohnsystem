export function exportCsv(
  data: { label: string; count: number; percent?: string }[],
  filename = "export.csv"
) {
  const header = "Schichtzeit;Anzahl;Prozent\n";
  const rows = data
    .map(row => `${row.label};${row.count};${row.percent ?? ""}%`)
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
