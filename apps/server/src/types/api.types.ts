interface ApiError<T = unknown> {
    error: string;
    details?: T
}

interface ApiSuccess<T = unknown> {
    message: string;
    data?: T
}





export type { ApiError, ApiSuccess }