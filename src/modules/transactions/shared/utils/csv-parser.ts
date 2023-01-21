type TCellValue = string;

export class CsvParser {
  private separator: string;
  private header: boolean;
  private LINE_ENDING = "\n";

  constructor(options: { separator?: string, header?: boolean } = {}) {
    const {separator = '\t', header = true} = options;
    this.separator = separator;
    this.header = header;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  stringify(data: { [key: string]: any }[]) {
    const keys = (typeof data[0] === 'object') && Object.keys(data[0]);
    const header = keys && keys.join(this.separator);
    const output = this.header ? (header + this.LINE_ENDING) : '';

    if (!data || !keys) return '';

    return output + data.map((obj) => {
      return keys.reduce((p, key) => {
        p.push(obj[key] ? obj[key].toString() : '');
        return p;
      }, [] as TCellValue[]).join(this.separator);
    }).join(this.LINE_ENDING)
  }

  parse(tsv: string) {
    const lines = tsv.replaceAll('\r', '').split(this.LINE_ENDING).filter(this.comments);
    const header = this.header ? this.getValues(lines.shift() || '', this.separator) : [];

    if (lines.length < 1) return [];

    return lines.map((line) => {
      const values = this.getValues(line, this.separator)
        .reduce((acc, val, i) => {
          acc.set((this.header ? header[i] : i), val);
          return acc;
        }, new Map<string | number, TCellValue>());

      return Object.fromEntries(values);
    });
  }

  private getValues(line: string, separator: string): TCellValue[] {
    return line.split(separator).map((value) => this.unquote(value))
  }

  private comments(line: string): boolean {
    return !/#@/.test(line[0]);
  }

  private unquote(str: string): string {
    const match = str.match(/(['"]?)(.*)\1/);
    return match && match[2] || str
  }
}
