import type { DataSourceResponse } from '@umbraco-cms/models';
import type { EntityTreeItemModel, PagedEntityTreeItemModel } from '@umbraco-cms/backend-api';

export interface RelationTypeTreeDataSource {
	getRootItems(): Promise<DataSourceResponse<PagedEntityTreeItemModel>>;
	getItems(key: Array<string>): Promise<DataSourceResponse<EntityTreeItemModel[]>>;
}
