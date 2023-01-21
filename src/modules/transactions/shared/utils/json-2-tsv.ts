import {CsvParser} from "./csv-parser";

export function json2Tsv(jsons: { [key: string]: string | number | boolean | null }[]): string {
  const parser = new CsvParser();
  return parser.stringify(jsons);
}
