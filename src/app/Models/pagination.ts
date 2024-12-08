export interface PaginationResponse<T> {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    data: T[];
  }
  