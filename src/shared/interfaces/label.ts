export type ILabel<P = unknown, IdentifierType = string> = P & {
  id: IdentifierType;
  title: string;
}
