import { css, html, customElement, state, nothing, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UUIPaginationEvent } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { RelationItemResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbDocumentTrackedReferenceRepository } from '@umbraco-cms/backoffice/document';

@customElement('umb-document-workspace-view-info-reference')
export class UmbDocumentWorkspaceViewInfoReferenceElement extends UmbLitElement {
	#itemsPerPage = 10;
	#trackedReferenceRepository;

	@state()
	private _currentPage = 1;

	@state()
	private _total = 0;

	@state()
	private _items?: Array<RelationItemResponseModel> = [
		{
			nodeId: '3f23cc76-a645-4032-82b3-c16458e97215',
			nodeName: 'hey',
			nodeType: 'document',
			nodePublished: true,
			contentTypeIcon: 'icon-document',
			contentTypeAlias: 'blockListTest',
			contentTypeName: 'Block List Test',
			relationTypeName: 'Related Document',
			relationTypeIsBidirectional: false,
			relationTypeIsDependency: true,
		},
	];

	constructor() {
		super();
		this.#trackedReferenceRepository = new UmbDocumentTrackedReferenceRepository(this);

		this.#getReferences();
	}

	async #getReferences() {
		const { data } = await this.#trackedReferenceRepository.requestTrackedReference(
			'3f23cc76-a645-4032-82b3-c16458e97215',
		);
		if (!data) return;

		this._total = data.total;
		this._items = data.items;
	}

	#onPageChange(event: UUIPaginationEvent) {
		if (this._currentPage === event.target.current) return;
		this._currentPage = event.target.current;
	}

	render() {
		if (this._items && this._items.length > 0) {
			return html`<strong>
					<umb-localize key="references_labelUsedByItems">Referenced by the following items</umb-localize>
				</strong>
				<uui-box style="--uui-box-default-padding:0">
					<uui-table>
						<uui-table-head>
							<uui-table-head-cell></uui-table-head-cell>
							<uui-table-head-cell>Name</uui-table-head-cell>
							<uui-table-head-cell>Status</uui-table-head-cell>
							<uui-table-head-cell>Type Name</uui-table-head-cell>
							<uui-table-head-cell>Type</uui-table-head-cell>
							<uui-table-head-cell>Relation</uui-table-head-cell>
						</uui-table-head>

						${repeat(
							this._items,
							(item) => item.nodeId,
							(item) =>
								html`<uui-table-row>
									<uui-table-cell>
										<uui-icon style=" vertical-align: middle;" name="icon-document"></uui-icon>
									</uui-table-cell>
									<uui-table-cell class="link-cell">${item.nodeName}</uui-table-cell>
									<uui-table-cell>
										${item.nodePublished
											? this.localize.term('content_published')
											: this.localize.term('content_unpublished')}
									</uui-table-cell>
									<uui-table-cell>${item.contentTypeName}</uui-table-cell>
									<uui-table-cell>${item.nodeType}</uui-table-cell>
									<uui-table-cell>${item.relationTypeName}</uui-table-cell>
								</uui-table-row>`,
						)}
					</uui-table>
				</uui-box>
				${this.#renderReferencePagination()}`;
		} else {
			return nothing;
		}
	}

	#renderReferencePagination() {
		if (!this._total) return nothing;

		const totalPages = Math.ceil(this._total / this.#itemsPerPage);

		if (totalPages <= 1) return nothing;

		return html`<div class="pagination">
			<uui-pagination .total=${totalPages} @change="${this.#onPageChange}"></uui-pagination>
		</div>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			.link-cell {
				font-weight: bold;
			}

			uui-table-cell:not(.link-cell) {
				color: var(--uui-color-text-alt);
			}

			uui-pagination {
				flex: 1;
				display: inline-block;
			}

			.pagination {
				display: flex;
				justify-content: center;
				margin-top: var(--uui-size-space-4);
			}
		`,
	];
}

export default UmbDocumentWorkspaceViewInfoReferenceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-view-info-reference': UmbDocumentWorkspaceViewInfoReferenceElement;
	}
}
