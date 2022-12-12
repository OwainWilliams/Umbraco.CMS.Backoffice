import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UmbModalService } from '../../../../../core/services/modal';
import { UmbDataTypesStore } from '../../../../../core/stores/data-types/data-types.store';
import UmbTreeItemActionElement from '../../../shared/tree-item-action.element';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';

@customElement('umb-tree-action-data-type-delete')
export default class UmbTreeActionDataTypeDeleteElement extends UmbContextConsumerMixin(UmbTreeItemActionElement) {
	static styles = [UUITextStyles, css``];

	private _modalService?: UmbModalService;
	private _dataTypeStore?: UmbDataTypesStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext('umbModalService', (modalService: UmbModalService) => {
			this._modalService = modalService;
		});

		this.consumeContext('umbDataTypeStore', (dataTypeStore: UmbDataTypesStore) => {
			this._dataTypeStore = dataTypeStore;
		});
	}

	private _handleLabelClick() {
		const modalHandler = this._modalService?.confirm({
			headline: `Delete ${this._activeTreeItem?.name ?? 'item'}`,
			content: 'Are you sure you want to delete this item?',
			color: 'danger',
			confirmLabel: 'Delete',
		});

		modalHandler?.onClose().then(({ confirmed }: any) => {
			if (confirmed && this._treeContextMenuService && this._dataTypeStore && this._activeTreeItem) {
				this._dataTypeStore?.deleteItems([this._activeTreeItem.key]);
				this._treeContextMenuService.close();
			}
		});
	}

	render() {
		return html`<uui-menu-item label=${this.treeAction?.meta.label ?? ''} @click-label="${this._handleLabelClick}">
			<uui-icon slot="icon" name=${this.treeAction?.meta.icon ?? ''}></uui-icon>
		</uui-menu-item>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-data-type-delete': UmbTreeActionDataTypeDeleteElement;
	}
}
