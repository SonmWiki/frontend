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
    title: string;
    content: string;
    categoryIds: string[];
}

export interface CreateArticleResponse {
    id: string;
}

export interface CreateCategoryRequest {
    name: string;
    parentId: string | null;
}

export interface CreateCategoryResponse {
    id: string;
}

export interface DeleteArticleResponse {
    id: string;
}

export interface DeleteCategoryResponse {
    id: string;
}

export interface EditArticleRequest {
    content: string;
    categoryIds: string[];
}

export interface EditArticleResponse {
    id: string;
}

export interface EditCategoryResponse {
    id: string;
}

export interface GetArticleResponse {
    id: string;
    title: string;
    content: string | null;
    contributors: GetArticleResponseAuthor[];
    /** @format uuid */
    revisionId: string | null;
    reviewStatus: ReviewStatus;
    /** @format date-time */
    submittedTimestamp: string | null;
    /** @format date-time */
    reviewTimestamp: string | null;
    categories: GetArticleResponseCategory[];
}

export interface GetArticleResponseAuthor {
    id: string;
    name: string;
}

export interface GetArticleResponseCategory {
    id: string;
    name: string;
}

export interface GetCategoriesResponse {
    data: GetCategoriesResponseElement[];
}

export interface GetCategoriesResponseElement {
    id: string;
    name: string;
    parentId: string | null;
}

export interface GetCategoriesTreeResponse {
    data: GetCategoriesTreeResponseElement[];
}

export interface GetCategoriesTreeResponseElement {
    id: string;
    name: string;
    children: GetCategoriesTreeResponseElement[];
}

export interface GetCategoryArticlesResponse {
    data: GetCategoryArticlesResponseElement[];
}

export interface GetCategoryArticlesResponseElement {
    id: string;
    title: string;
}

export interface GetNavigationsTreeResponse {
    data: GetNavigationsTreeResponseElement[];
}

export interface GetNavigationsTreeResponseElement {
    /** @format int32 */
    id: number;
    /** @format int32 */
    weight: number;
    name: string;
    uri: string | null;
    icon: string | null;
    children: GetNavigationsTreeResponseElement[];
}

export interface GetPendingRevisionsResponse {
    data: GetPendingRevisionsResponseElement[];
}

export interface GetPendingRevisionsResponseAuthor {
    id: string;
    name: string;
}

export interface GetPendingRevisionsResponseElement {
    articleId: string;
    articleIdTitle: string;
    /** @format uuid */
    revisionId: string;
    author: GetPendingRevisionsResponseAuthor;
    /** @format date-time */
    timestamp: string;
}

export interface GetRevisionHistoryResponse {
    data: GetRevisionHistoryResponseElement[];
}

export interface GetRevisionHistoryResponseAuthor {
    id: string;
    name: string;
}

export interface GetRevisionHistoryResponseElement {
    /** @format uuid */
    id: string;
    contributor: GetRevisionHistoryResponseAuthor;
    /** @format date-time */
    timestamp: string;
    latestReview: GetRevisionHistoryResponseReview;
}

export interface GetRevisionHistoryResponseReview {
    /** @format uuid */
    id: string;
    reviewer: GetRevisionHistoryResponseAuthor;
    status: ReviewStatus;
    message: string;
    /** @format date-time */
    reviewTimestamp: string;
}

export interface GetRevisionReviewHistoryResponse {
    data: GetRevisionReviewHistoryResponseElement[];
}

export interface GetRevisionReviewHistoryResponseElement {
    /** @format uuid */
    id: string;
    reviewer: GetRevisionReviewHistoryResponseReviewer;
    status: ReviewStatus;
    message: string;
    /** @format date-time */
    timestamp: string;
}

export interface GetRevisionReviewHistoryResponseReviewer {
    id: string;
    name: string;
}

export interface ProblemDetails {
    type: string | null;
    title: string | null;
    /** @format int32 */
    status: number | null;
    detail: string | null;
    instance: string | null;
    [key: string]: any;
}

export interface ReviewArticleRevisionRequest {
    status: ReviewStatus;
    review: string;
}

export interface ReviewRevisionResponse {
    /** @format uuid */
    id: string;
}

/** @format int32 */
export enum ReviewStatus {
    Value0 = 0,
    Value1 = 1,
    Value2 = 2,
}

export interface SearchArticlesResponse {
    /** @format int32 */
    page: number;
    /** @format int32 */
    count: number;
    /** @format int32 */
    totalCount: number;
    data: SearchArticlesResponseElement[];
}

export interface SearchArticlesResponseElement {
    id: string;
    articleTitle: string;
}

export interface SerArticleRedirectRequest {
    redirectArticleId: string;
}

export interface SetRedirectResponse {
    id: string;
}

export interface UpdateCategoryRequest {
    name: string;
    parentId: string | null;
}

export interface UpdateNavigationsTreeCommandElement {
    name: string;
    uri: string | null;
    icon: string | null;
    children: UpdateNavigationsTreeCommandElement[];
}

export interface UpdateNavigationsTreeRequest {
    data: UpdateNavigationsTreeCommandElement[];
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
                                                   secure,
                                                   path,
                                                   type,
                                                   query,
                                                   format,
                                                   body,
                                                   ...params
                                               }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }

        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
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
         * @name SearchArticles
         * @request GET:/api/articles
         * @secure
         */
        searchArticles: (
            query?: {
                searchTerm?: string;
                /**
                 * @format int32
                 * @default 1
                 */
                page?: number;
                /**
                 * @format int32
                 * @default 50
                 */
                pageSize?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<SearchArticlesResponse, any>({
                path: `/api/articles`,
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

        /**
         * No description
         *
         * @tags Navigations
         * @name UpdateNavigationsTree
         * @request PUT:/api/navigations/tree
         * @secure
         */
        updateNavigationsTree: (data: UpdateNavigationsTreeRequest, params: RequestParams = {}) =>
            this.request<GetNavigationsTreeResponse, ProblemDetails>({
                path: `/api/navigations/tree`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    };
}
