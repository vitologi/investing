import { IPropertySorting } from './property-sorting';

export interface IListFilter {
  offset: number;
  limit: number;
  ids: string[];
  sort: IPropertySorting[];
}
