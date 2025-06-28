export interface ISchema {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IBaseEntity {
  ID: string;
  createdAt: Date;
  updatedAt?: Date;
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

export interface IError {
  message: string;
  status: number;
  errors?: string[];
}
