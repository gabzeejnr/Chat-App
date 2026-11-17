import type { ApiSuccess, PaginationMeta } from "@chat-app/shared";

interface ApiError<T = unknown> {
    error: string;
    details?: T
}

export type { ApiError, ApiSuccess, PaginationMeta };