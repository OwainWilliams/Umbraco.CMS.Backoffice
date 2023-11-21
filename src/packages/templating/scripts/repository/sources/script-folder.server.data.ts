import {
	CreateFolderRequestModel,
	FolderModelBaseModel,
	FolderResponseModel,
	ScriptResource,
} from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { DataSourceResponse, UmbFolderDataSource } from '@umbraco-cms/backoffice/repository';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

//! this is of any type in the backend-api
export type ScriptGetFolderResponse = { path: string; parentPath: string; name: string };

export class UmbScriptFolderServerDataSource implements UmbFolderDataSource {
	#host: UmbControllerHost;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}
	createScaffold(parentId: string | null): Promise<DataSourceResponse<FolderResponseModel>> {
		throw new Error('Method not implemented.');
	}
	read(unique: string): Promise<DataSourceResponse<ScriptGetFolderResponse>> {
		return tryExecuteAndNotify(this.#host, ScriptResource.getScriptFolder({ path: unique }));
	}
	create(requestBody: CreateFolderRequestModel): Promise<DataSourceResponse<string>> {
		return tryExecuteAndNotify(this.#host, ScriptResource.postScriptFolder({ requestBody }));
	}
	update(unique: string, data: CreateFolderRequestModel): Promise<DataSourceResponse<FolderModelBaseModel>> {
		throw new Error('Method not implemented.');
	}
	delete(path: string): Promise<DataSourceResponse<unknown>> {
		return tryExecuteAndNotify(this.#host, ScriptResource.deleteScriptFolder({ path }));
	}
}