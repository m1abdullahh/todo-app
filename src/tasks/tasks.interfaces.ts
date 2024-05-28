import { PaginateOptions } from 'src/common/interfaces';

export type TasksSearch = {
  name?: string;
  is_active?: boolean;
  priority?: string;
  status?: string;
  from?: string;
  to?: string;
} & PaginateOptions;
