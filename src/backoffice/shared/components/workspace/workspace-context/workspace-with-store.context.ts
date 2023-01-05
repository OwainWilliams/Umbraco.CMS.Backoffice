import { UmbWorkspaceContext } from './workspace.context';
import { UmbDataStoreBase } from '@umbraco-cms/stores/store';
import { ContentTreeItem } from '@umbraco-cms/backend-api';
import { UmbControllerHostInterface } from 'src/core/controller/controller-host.mixin';
import { UmbContextConsumerController } from 'src/core/context-api/consume/context-consumer.controller';

// TODO: Consider if its right to have this many class-inheritance of WorkspaceContext
export abstract class UmbWorkspaceWithStoreContext<
	DataType extends ContentTreeItem,
	StoreType extends UmbDataStoreBase<DataType>
> extends UmbWorkspaceContext<DataType> {

	protected _store!: StoreType; // TODO: Double check its right to assume it here, at least from a type perspective?

	//protected _dataObserver?: Subscription;

	constructor(host: UmbControllerHostInterface, defaultData: DataType, storeAlias: string) {
		super(host, defaultData);

		// TODO: consider if store alias should be configurable of manifest:
		new UmbContextConsumerController(host, storeAlias, (_instance: StoreType) => {
			this._store = _instance;
			if (!this._store) {
				// TODO: if we keep the type assumption of _store existing, then we should here make sure to break the application in a good way.
				return;
			}
			this._onStoreSubscription();
		});
	}

	protected abstract _onStoreSubscription(): void;
	/* {
		this._dataObserver = this._store.getByKey(this.entityKey).subscribe((content) => {
			if (!content) return; // TODO: Handle nicely if there is no content data.
			this.update(content as any);
		});
	}*/

	public getStore(): StoreType {
		return this._store;
	}

	/*
	// Document Store:
	public save() {
		this._store.save([this.getData()]).then(() => {
			const data: UmbNotificationDefaultData = { message: 'Document Saved' };
			this._notificationService?.peek('positive', { data });
		}).catch(() => {
			const data: UmbNotificationDefaultData = { message: 'Failed to save Document' };
			this._notificationService?.peek('danger', { data });
		});
	}
	*/

	/*
	public destroy(): void {
		super.destroy();
		if (this._storeConsumer) {
			this._storeConsumer.hostDisconnected();
		}
		if (this._dataObserver) {
			// I want to make sure that we unsubscribe, also if store(observer source) changes.
			this._dataObserver?.unsubscribe();
		}
	}
	*/
}