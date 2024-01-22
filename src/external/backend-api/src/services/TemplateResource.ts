/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTemplateRequestModel } from '../models/CreateTemplateRequestModel';
import type { PagedNamedEntityTreeItemResponseModel } from '../models/PagedNamedEntityTreeItemResponseModel';
import type { TemplateItemResponseModel } from '../models/TemplateItemResponseModel';
import type { TemplateQueryExecuteModel } from '../models/TemplateQueryExecuteModel';
import type { TemplateQueryResultResponseModel } from '../models/TemplateQueryResultResponseModel';
import type { TemplateQuerySettingsResponseModel } from '../models/TemplateQuerySettingsResponseModel';
import type { TemplateResponseModel } from '../models/TemplateResponseModel';
import type { TemplateScaffoldResponseModel } from '../models/TemplateScaffoldResponseModel';
import type { UpdateTemplateRequestModel } from '../models/UpdateTemplateRequestModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TemplateResource {

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postTemplate({
        requestBody,
    }: {
        requestBody?: CreateTemplateRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/template',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Generated-Resource',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getTemplateById({
        id,
    }: {
        id: string,
    }): CancelablePromise<TemplateResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/template/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static deleteTemplateById({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/management/api/v1/template/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putTemplateById({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: UpdateTemplateRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/template/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getTemplateItem({
        id,
    }: {
        id?: Array<string>,
    }): CancelablePromise<Array<TemplateItemResponseModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/template/item',
            query: {
                'id': id,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postTemplateQueryExecute({
        requestBody,
    }: {
        requestBody?: TemplateQueryExecuteModel,
    }): CancelablePromise<TemplateQueryResultResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/template/query/execute',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getTemplateQuerySettings(): CancelablePromise<TemplateQuerySettingsResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/template/query/settings',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getTemplateScaffold({
        masterTemplateId,
    }: {
        masterTemplateId?: string,
    }): CancelablePromise<TemplateScaffoldResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/template/scaffold',
            query: {
                'masterTemplateId': masterTemplateId,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns PagedNamedEntityTreeItemResponseModel Success
     * @throws ApiError
     */
    public static getTreeTemplateChildren({
        parentId,
        skip,
        take = 100,
    }: {
        parentId?: string,
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedNamedEntityTreeItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/tree/template/children',
            query: {
                'parentId': parentId,
                'skip': skip,
                'take': take,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns PagedNamedEntityTreeItemResponseModel Success
     * @throws ApiError
     */
    public static getTreeTemplateRoot({
        skip,
        take = 100,
    }: {
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedNamedEntityTreeItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/tree/template/root',
            query: {
                'skip': skip,
                'take': take,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
