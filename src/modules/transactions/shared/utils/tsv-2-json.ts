import {CsvParser} from "./csv-parser";

export function tsv2Json(data: string): { [key: string]: string }[] {
  const parser = new CsvParser();
  return parser.parse(data);
}
