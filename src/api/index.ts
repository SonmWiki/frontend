/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateArticleRequest {
    title?: string;
    content?: string;
    categoryIds?: string[];
}

export interface CreateArticleResponse {
    id?: string;
}

export interface CreateCategoryRequest {
    name?: string;
    parentId?: string | null;
}

export interface CreateCategoryResponse {
    id?: string;
}

export interface DeleteArticleResponse {
    id?: string;
}

export interface DeleteCategoryResponse {
    id?: string;
}

export interface EditArticleRequest {
    content?: string;
    categoryIds?: string[];
}

export interface EditArticleResponse {
    id?: string;
}

export interface EditCategoryResponse {
    id?: string;
}

export interface GetArticleResponse {
    id?: string;
    title?: string;
    content?: string | null;
    contributors?: GetArticleResponseAuthor[];
    /** @format uuid */
    revisionId?: string | null;
    reviewStatus?: ReviewStatus;
    /** @format date-time */
    submittedTimestamp?: string | null;
    /** @format date-time */
    reviewTimestamp?: string | null;
    categories?: GetArticleResponseCategory[];
}

export interface GetArticleResponseAuthor {
    id?: string;
    name?: string;
}

export interface GetArticleResponseCategory {
    id?: string;
    name?: string;
}

export interface GetCategoriesResponse {
    data?: GetCategoriesResponseElement[];
}

export interface GetCategoriesResponseElement {
    id?: string;
    name?: string;
    parentId?: string | null;
}

export interface GetCategoriesTreeResponse {
    data?: GetCategoriesTreeResponseElement[];
}

export interface GetCategoriesTreeResponseElement {
    id?: string;
    name?: string;
    children?: GetCategoriesTreeResponseElement[];
}

export interface GetCategoryArticlesResponse {
    data?: GetCategoryArticlesResponseElement[];
}

export interface GetCategoryArticlesResponseElement {
    id?: string;
    title?: string;
}

export interface GetNavigationsTreeResponse {
    data?: GetNavigationsTreeResponseElement[];
}

export interface GetNavigationsTreeResponseElement {
    /** @format int32 */
    id?: number;
    /** @format int32 */
    weight?: number;
    name?: string;
    uri?: string | null;
    children?: GetNavigationsTreeResponseElement[];
}

export interface GetPendingRevisionsResponse {
    data?: GetPendingRevisionsResponseElement[];
}

export interface GetPendingRevisionsResponseAuthor {
    id?: string;
    name?: string;
}

export interface GetPendingRevisionsResponseElement {
    articleId?: string;
    articleIdTitle?: string;
    /** @format uuid */
    revisionId?: string;
    author?: GetPendingRevisionsResponseAuthor;
    /** @format date-time */
    timestamp?: string;
}

export interface GetRevisionHistoryResponse {
    data?: GetRevisionHistoryResponseElement[];
}

export interface GetRevisionHistoryResponseAuthor {
    id?: string;
    name?: string;
}

export interface GetRevisionHistoryResponseElement {
    /** @format uuid */
    id?: string;
    contributor?: GetRevisionHistoryResponseAuthor;
    /** @format date-time */
    timestamp?: string;
    latestReview?: GetRevisionHistoryResponseReview;
}

export interface GetRevisionHistoryResponseReview {
    /** @format uuid */
    id?: string;
    reviewer?: GetRevisionHistoryResponseAuthor;
    status?: ReviewStatus;
    message?: string;
    /** @format date-time */
    reviewTimestamp?: string;
}

export interface GetRevisionReviewHistoryResponse {
    data?: GetRevisionReviewHistoryResponseElement[];
}

export interface GetRevisionReviewHistoryResponseElement {
    /** @format uuid */
    id?: string;
    reviewer?: GetRevisionReviewHistoryResponseReviewer;
    status?: ReviewStatus;
    message?: string;
    /** @format date-time */
    timestamp?: string;
}

export interface GetRevisionReviewHistoryResponseReviewer {
    id?: string;
    name?: string;
}

export interface ProblemDetails {
    type?: string | null;
    title?: string | null;
    /** @format int32 */
    status?: number | null;
    detail?: string | null;
    instance?: string | null;
    [key: string]: any;
}

export interface ReviewArticleRevisionRequest {
    status?: ReviewStatus;
    review?: string;
}

export interface ReviewRevisionResponse {
    /** @format uuid */
    id?: string;
}

/** @format int32 */
export enum ReviewStatus {
    Value0 = 0,
    Value1 = 1,
    Value2 = 2,
}

export interface SerArticleRedirectRequest {
    redirectArticleId?: string;
}

export interface SetRedirectResponse {
    id?: string;
}

export interface UpdateCategoryRequest {
    name?: string;
    parentId?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat;
    /** request body */
    body?: unknown;
    /** base url */
    baseUrl?: string;
    /** request cancellation token */
    cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
    securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
    customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
    data: D;
    error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = "";
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private abortControllers = new Map<CancelToken, AbortController>();
    private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

    private baseApiParams: RequestParams = {
        credentials: "same-origin",
        headers: {},
        redirect: "follow",
        referrerPolicy: "no-referrer",
    };

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig);
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key]);
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key];
        return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
        return keys
            .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
            .join("&");
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : "";
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
        [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
        [ContentType.FormData]: (input: any) =>
            Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key];
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === "object" && property !== null
                            ? JSON.stringify(property)
                            : `${property}`,
                );
                return formData;
            }, new FormData()),
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
    };

    protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                return abortController.signal;
            }
            return void 0;
        }

        const abortController = new AbortController();
        this.abortControllers.set(cancelToken, abortController);
        return abortController.signal;
    };

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken);

        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(cancelToken);
        }
    };

    public request = async <T = any, E = any>({
                                                  body,
                                                  secure,
                                                  path,
                                                  type,
                                                  query,
                                                  format,
                                                  baseUrl,
                                                  cancelToken,
                                                  ...params
                                              }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const queryString = query && this.toQueryString(query);
        const payloadFormatter = this.contentFormatters[type || ContentType.Json];
        const responseFormat = format || requestParams.format;

        return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
            },
            signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
            body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
        }).then(async (response) => {
            const r = response as HttpResponse<T, E>;
            r.data = null as unknown as T;
            r.error = null as unknown as E;

            const data = !responseFormat
                ? r
                : await response[responseFormat]()
                    .then((data) => {
                        if (r.ok) {
                            r.data = data;
                        } else {
                            r.error = data;
                        }
                        return r;
                    })
                    .catch((e) => {
                        r.error = e;
                        return r;
                    });

            if (cancelToken) {
                this.abortControllers.delete(cancelToken);
            }

            if (!response.ok) throw data;
            return data;
        });
    };
}

/**
 * @title WebApi
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    api = {
        /**
         * No description
         *
         * @tags Article
         * @name CreateArticle
         * @request POST:/api/articles
         * @secure
         */
        createArticle: (data: CreateArticleRequest, params: RequestParams = {}) =>
            this.request<CreateArticleResponse, ProblemDetails>({
                path: `/api/articles`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name GetArticle
         * @request GET:/api/articles/{id}
         * @secure
         */
        getArticle: (
            id: string,
            query?: {
                /** @format uuid */
                revisionId?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<GetArticleResponse, ProblemDetails>({
                path: `/api/articles/${id}`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name EditArticle
         * @request PUT:/api/articles/{id}
         * @secure
         */
        editArticle: (id: string, data: EditArticleRequest, params: RequestParams = {}) =>
            this.request<EditArticleResponse, ProblemDetails>({
                path: `/api/articles/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name DeleteArticle
         * @request DELETE:/api/articles/{id}
         * @secure
         */
        deleteArticle: (id: string, params: RequestParams = {}) =>
            this.request<DeleteArticleResponse, ProblemDetails>({
                path: `/api/articles/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name SetArticleRedirect
         * @request PUT:/api/articles/{id}/redirect
         * @secure
         */
        setArticleRedirect: (id: string, data: SerArticleRedirectRequest, params: RequestParams = {}) =>
            this.request<SetRedirectResponse, ProblemDetails>({
                path: `/api/articles/${id}/redirect`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name PendingRevisions
         * @request GET:/api/articles/revisions/pending
         * @secure
         */
        pendingRevisions: (params: RequestParams = {}) =>
            this.request<GetPendingRevisionsResponse, ProblemDetails>({
                path: `/api/articles/revisions/pending`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name RevisionHistory
         * @request GET:/api/articles/{id}/revisions
         * @secure
         */
        revisionHistory: (id: string, params: RequestParams = {}) =>
            this.request<GetRevisionHistoryResponse, ProblemDetails>({
                path: `/api/articles/${id}/revisions`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name RevisionReviewHistory
         * @request GET:/api/articles/revisions/{id}/reviews
         * @secure
         */
        revisionReviewHistory: (id: string, params: RequestParams = {}) =>
            this.request<GetRevisionReviewHistoryResponse, ProblemDetails>({
                path: `/api/articles/revisions/${id}/reviews`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Article
         * @name ReviewArticleRevision
         * @request POST:/api/articles/revisions/{id}/reviews
         * @secure
         */
        reviewArticleRevision: (id: string, data: ReviewArticleRevisionRequest, params: RequestParams = {}) =>
            this.request<ReviewRevisionResponse, ProblemDetails>({
                path: `/api/articles/revisions/${id}/reviews`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Category
         * @name CreateCategory
         * @request POST:/api/categories
         * @secure
         */
        createCategory: (data: CreateCategoryRequest, params: RequestParams = {}) =>
            this.request<CreateCategoryResponse, ProblemDetails>({
                path: `/api/categories`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Category
         * @name GetCategories
         * @request GET:/api/categories
         * @secure
         */
        getCategories: (params: RequestParams = {}) =>
            this.request<GetCategoriesResponse, any>({
                path: `/api/categories`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Category
         * @name GetCategoriesTree
         * @request GET:/api/categories/tree
         * @secure
         */
        getCategoriesTree: (params: RequestParams = {}) =>
            this.request<GetCategoriesTreeResponse, any>({
                path: `/api/categories/tree`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Category, Article
         * @name GetCategoryArticles
         * @request GET:/api/categories/{id}/articles
         * @secure
         */
        getCategoryArticles: (id: string, params: RequestParams = {}) =>
            this.request<GetCategoryArticlesResponse, ProblemDetails>({
                path: `/api/categories/${id}/articles`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Category
         * @name UpdateCategory
         * @request PUT:/api/categories/{id}
         * @secure
         */
        updateCategory: (id: string, data: UpdateCategoryRequest, params: RequestParams = {}) =>
            this.request<EditCategoryResponse, ProblemDetails>({
                path: `/api/categories/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Category
         * @name DeleteCategory
         * @request DELETE:/api/categories/{id}
         * @secure
         */
        deleteCategory: (id: string, params: RequestParams = {}) =>
            this.request<DeleteCategoryResponse, ProblemDetails>({
                path: `/api/categories/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags Navigations
         * @name GetNavigationsTree
         * @request GET:/api/navigations/tree
         * @secure
         */
        getNavigationsTree: (params: RequestParams = {}) =>
            this.request<GetNavigationsTreeResponse, any>({
                path: `/api/navigations/tree`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
}
