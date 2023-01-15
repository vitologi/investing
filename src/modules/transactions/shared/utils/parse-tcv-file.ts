export function parseTcvFile(data: string): { [key: string]: string }[] {
  const rows = data.split('\n').map((row) => row.split('\t'));
  const header = rows.shift();

  if (!header) {
    return [];
  }

  return rows
    .map((row) => {
      const resultMap = new Map<string, string>();
      for (let i = 0; i < header.length; i++) {
        resultMap.set(header[i], row[i]);
      }

      return Object.fromEntries(resultMap);
    })
}
