export interface ISchema {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IResponse<T> {
  data: T;
  message: string;
  status: string;
}
