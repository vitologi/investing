export interface ILabel<IdentifierType = string> {
  id: IdentifierType;
  title: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [key: string]: any;
}
