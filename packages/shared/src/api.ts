interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface CollectionMeta {
    total: number;
    count: number;
    pagination: PaginationMeta;
}

interface ApiSuccess<T = unknown, M = Record<string, unknown>> {
    message: string;
    data?: T;
    meta?: M;
}

type PaginatedApiSuccess<T> = ApiSuccess<T, CollectionMeta> & {
    data: T;
    meta: CollectionMeta;
};

export type { ApiSuccess, CollectionMeta, PaginatedApiSuccess, PaginationMeta };
