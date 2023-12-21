import {
	UMB_DOCUMENT_TYPE_PICKER_MODAL,
	UMB_MODAL_MANAGER_CONTEXT_TOKEN,
	UMB_WORKSPACE_MODAL,
	UmbModalRouteRegistrationController,
} from '@umbraco-cms/backoffice/modal';
import { UmbBlockTypeBase } from '../../types.js';
import '../block-type-card/index.js';
import { css, html, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';

@customElement('umb-input-block-type')
export class UmbInputBlockTypeElement<BlockType extends UmbBlockTypeBase = UmbBlockTypeBase> extends UmbLitElement {
	//
	@property({ type: Array, attribute: false })
	public get value() {
		return this._items;
	}
	public set value(items) {
		this._items = items ?? [];
	}

	@state()
	private _items: Array<BlockType> = [];

	@state()
	private _workspacePath?: string;

	#blockTypeWorkspaceModalRegistration;

	constructor() {
		super();

		this.#blockTypeWorkspaceModalRegistration = new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
			.addAdditionalPath('block-type')
			.onSetup(() => {
				return { data: { entityType: 'block-type', preset: {} } };
			})
			.observeRouteBuilder((routeBuilder) => {
				const newpath = routeBuilder({});
				this._workspacePath = newpath;
			});
	}

	create() {
		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT_TOKEN, async (modalManager) => {
			if (modalManager) {
				// TODO: Make as mode for the Picker Modal, so the click to select immediately submits the modal(And in that mode we do not want to see a Submit button).
				const modalContext = modalManager.open(UMB_DOCUMENT_TYPE_PICKER_MODAL, {
					data: {
						hideTreeRoot: true,
						multiple: false,
						pickableFilter: (docType) =>
							// Only pick elements:
							docType.isElement &&
							// Prevent picking the an already used element type:
							this._items.find((x) => x.contentElementTypeKey === docType.id) === undefined,
					},
				});

				const modalValue = await modalContext?.onSubmit();
				const selectedElementType = modalValue.selection[0];
				if (selectedElementType) {
					this.#blockTypeWorkspaceModalRegistration.open({}, 'create/' + selectedElementType);
				}
			}
		});

		// No need to fire a change event, as all changes are made directly to the property, via context api.
	}

	deleteItem(contentElementTypeKey: string) {
		this._items = this._items.filter((x) => x.contentElementTypeKey !== contentElementTypeKey);
		this.dispatchEvent(new UmbChangeEvent());
	}

	protected getFormElement() {
		return undefined;
	}

	render() {
		return html`
			${this._items ? repeat(this._items, (item) => item.contentElementTypeKey, this.#renderItem) : ''}
			${this.#renderButton()}
		`;
	}

	#renderButton() {
		return html`
			<uui-button id="add-button" look="placeholder" @click=${() => this.create()} label="open">
				<uui-icon name="icon-add"></uui-icon>
				Add
			</uui-button>
		`;
	}

	#renderItem = (item: BlockType) => {
		return html`
			<umb-block-type-card
				.workspacePath=${this._workspacePath}
				.key=${item.contentElementTypeKey}
				@delete=${() => this.deleteItem(item.contentElementTypeKey)}>
			</umb-block-type-card>
		`;
	};

	static styles = [
		css`
			:host {
				display: grid;
				gap: var(--uui-size-space-3);
				grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
			}

			#add-button {
				text-align: center;
				height: 160px;
			}

			uui-icon {
				display: block;
				margin: 0 auto;
			}
		`,
	];
}

export default UmbInputBlockTypeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-block-type': UmbInputBlockTypeElement;
	}
}
