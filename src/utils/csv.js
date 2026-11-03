// Saves a table as a CSV file: downloadCsv('Name', { columns: [...], rows: [[...]] }).
export function downloadCsv(name, table) {
  const escape = (cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`;
  const csv = [table.columns, ...table.rows].map((row) => row.map(escape).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
