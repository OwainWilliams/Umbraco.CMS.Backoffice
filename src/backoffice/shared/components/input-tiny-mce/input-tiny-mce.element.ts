import { html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { FormControlMixin } from '@umbraco-ui/uui-base/lib/mixins';
import { AstNode, Editor, EditorEvent, TinyMCE } from 'tinymce';
import { UmbMediaHelper } from '../../property-editors/uis/tiny-mce/media-helper.service';
import { TinyMceCodeEditorPlugin } from '../../property-editors/uis/tiny-mce/plugins/tiny-mce-code-editor.plugin';
import { TinyMceLinkPickerPlugin } from '../../property-editors/uis/tiny-mce/plugins/tiny-mce-linkpicker.plugin';
import { TinyMceMacroPlugin } from '../../property-editors/uis/tiny-mce/plugins/tiny-mce-macro.plugin';
import { TinyMceMediaPickerPlugin } from '../../property-editors/uis/tiny-mce/plugins/tiny-mce-mediapicker.plugin';
import { TinyMceEmbeddedMediaPlugin } from '../../property-editors/uis/tiny-mce/plugins/tiny-mce-embeddedmedia.plugin';
import {
	UmbCurrentUserStore,
	UMB_CURRENT_USER_STORE_CONTEXT_TOKEN,
} from '../../../users/current-user/current-user.store';
import { UmbLitElement } from '@umbraco-cms/element';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/modal';
import type { UserDetails } from '@umbraco-cms/models';
import { DataTypePropertyModel } from '@umbraco-cms/backend-api';

/// TINY MCE
import '../../../../../public-assets/tiny-mce/tinymce.min.js';
import '@tinymce/tinymce-webcomponent';

declare global {
	interface Window {
		tinyConfig: { [key: string]: string | number | boolean | object | (() => void) };
		tinymce: TinyMCE;
		Umbraco: any;
	}
}

@customElement('umb-input-tiny-mce')
export class UmbInputTinyMceElement extends FormControlMixin(UmbLitElement) {
	static styles = [UUITextStyles];

	@property()
	configuration: Array<DataTypePropertyModel> = [];

	@state()
	private _configObject: any = {};

	private _styleFormats = [
		{
			title: 'Headers',
			items: [
				{ title: 'Page header', block: 'h2' },
				{ title: 'Section header', block: 'h3' },
				{ title: 'Paragraph header', block: 'h4' },
			],
		},
		{
			title: 'Blocks',
			items: [{ title: 'Normal', block: 'p' }],
		},
		{
			title: 'Containers',
			items: [
				{ title: 'Quote', block: 'blockquote' },
				{ title: 'Code', block: 'code' },
			],
		},
	];

	// these languages are available for localization
	#availableLanguages = [
		'ar',
		'ar_SA',
		'hy',
		'az',
		'eu',
		'be',
		'bn_BD',
		'bs',
		'bg_BG',
		'ca',
		'zh_CN',
		'zh_TW',
		'hr',
		'cs',
		'da',
		'dv',
		'nl',
		'en_CA',
		'en_GB',
		'et',
		'fo',
		'fi',
		'fr_FR',
		'gd',
		'gl',
		'ka_GE',
		'de',
		'de_AT',
		'el',
		'he_IL',
		'hi_IN',
		'hu_HU',
		'is_IS',
		'id',
		'it',
		'ja',
		'kab',
		'kk',
		'km_KH',
		'ko_KR',
		'ku',
		'ku_IQ',
		'lv',
		'lt',
		'lb',
		'ml',
		'ml_IN',
		'mn_MN',
		'nb_NO',
		'fa',
		'fa_IR',
		'pl',
		'pt_BR',
		'pt_PT',
		'ro',
		'ru',
		'sr',
		'si_LK',
		'sk',
		'sl_SI',
		'es',
		'es_MX',
		'sv_SE',
		'tg',
		'ta',
		'ta_IN',
		'tt',
		'th_TH',
		'tr',
		'tr_TR',
		'ug',
		'uk',
		'uk_UA',
		'vi',
		'vi_VN',
		'cy',
	];

	//define fallback language
	#defaultLanguage = 'en_US';

	//These are absolutely required in order for the macros to render inline
	//we put these as extended elements because they get merged on top of the normal allowed elements by tiny mce
	#extendedValidElements =
		'@[id|class|style],-div[id|dir|class|align|style],ins[datetime|cite],-ul[class|style],-li[class|style],-h1[id|dir|class|align|style],-h2[id|dir|class|align|style],-h3[id|dir|class|align|style],-h4[id|dir|class|align|style],-h5[id|dir|class|align|style],-h6[id|style|dir|class|align],span[id|class|style|lang],figure,figcaption';

	// If no config provided, fallback to these sensible defaults
	#fallbackConfig = {
		toolbar: [
			'ace',
			'styles',
			'bold',
			'italic',
			'alignleft',
			'aligncenter',
			'alignright',
			'bullist',
			'numlist',
			'outdent',
			'indent',
			'link',
			'umbmediapicker',
			'umbmacro',
			'umbembeddialog',
		],
		stylesheets: [],
		maxImageSize: 500,
	};

	// @property({ type: String })
	// private _contentStyle: string = contentUiSkinCss.toString() + '\n' + contentCss.toString();

	#currentUserStore?: UmbCurrentUserStore;
	modalContext!: UmbModalContext;
	#mediaHelper = new UmbMediaHelper(this);
	currentUser?: UserDetails;

	protected getFormElement() {
		return undefined;
	}

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this.modalContext = instance;
		});

		this.consumeContext(UMB_CURRENT_USER_STORE_CONTEXT_TOKEN, (instance) => {
			this.#currentUserStore = instance;
			this.#observeCurrentUser();
		});
	}

	async #observeCurrentUser() {
		if (!this.#currentUserStore) return;

		this.observe(this.#currentUserStore.currentUser, (currentUser) => {
			this.currentUser = currentUser;
		});
	}

	connectedCallback() {
		super.connectedCallback();

		this._configObject = this.configuration
			? Object.fromEntries(this.configuration.map((x) => [x.alias, x.value]))
			: this.#fallbackConfig;

		// no auto resize when a fixed height is set
		if (!this._configObject.dimensions?.height) {
			this._configObject.plugins.splice(this._configObject.plugins.indexOf('autoresize'), 1);
		}

		this.#setTinyConfig();
	}

	// TODO => setup runs before rendering, here we can add any custom plugins
	#setTinyConfig() {
		// set the default values that will not be modified via configuration
		window.tinyConfig = {
			autoresize_bottom_margin: 10,
			base_url: '/public-assets/tiny-mce',
			body_class: 'umb-rte',
			//see https://www.tiny.cloud/docs/tinymce/6/editor-important-options/#cache_suffix
			cache_suffix: '?umb__rnd=' + window.Umbraco?.Sys.ServerVariables.application.cacheBuster,
			contextMenu: false,
			language: () => this.#getLanguage(),
			menubar: false,
			paste_remove_styles_if_webkit: true,
			paste_preprocess: (_: Editor, args: { content: string }) => this.#cleanupPasteData(args),
			relative_urls: false,
			resize: false,
			statusbar: false,
			setup: (editor: Editor) => this.#editorSetup(editor),
		};

		// extend with configuration values
		Object.assign(window.tinyConfig, {
			content_css: this._configObject.stylesheets.join(','),
			extended_valid_elements: this.#extendedValidElements,
			height: ifDefined(this._configObject.dimensions?.height),
			invalid_elements: this._configObject.invalidElements,
			plugins: this._configObject.plugins.map((x: any) => x.name).join(' '),
			quickbars_insert_toolbar: this._configObject.toolbar.join(' '),
			quickbars_selection_toolbar: this._configObject.toolbar.join(' '),
			style_formats: this._styleFormats,
			toolbar: this._configObject.toolbar.join(' '),
			valid_elements: this._configObject.validElements,
			width: ifDefined(this._configObject.dimensions?.width),
		});

		// Need to check if we are allowed to UPLOAD images
		// This is done by checking if the insert image toolbar button is available
		if (this.#isMediaPickerEnabled()) {
			Object.assign(window.tinyConfig, {
				// Update the TinyMCE Config object to allow pasting
				images_upload_handler: this.#mediaHelper.uploadImageHandler,
				automatic_uploads: false,
				images_replace_blob_uris: false,
				// This allows images to be pasted in & stored as Base64 until they get uploaded to server
				paste_data_images: true,
			});
		}
	}

	#cleanupPasteData(args: { content: string }) {
		// Remove spans
		args.content = args.content.replace(/<\s*span[^>]*>(.*?)<\s*\/\s*span>/g, '$1');
		// Convert b to strong.
		args.content = args.content.replace(/<\s*b([^>]*)>(.*?)<\s*\/\s*b([^>]*)>/g, '<strong$1>$2</strong$3>');
		// convert i to em
		args.content = args.content.replace(/<\s*i([^>]*)>(.*?)<\s*\/\s*i([^>]*)>/g, '<em$1>$2</em$3>');
	}

	/**
	 * Returns the language to use for TinyMCE */
	#getLanguage() {
		const localeId = this.currentUser?.language;
		//try matching the language using full locale format
		let languageMatch = this.#availableLanguages.find((x) => x.toLowerCase() === localeId);

		//if no matches, try matching using only the language
		if (!languageMatch) {
			const localeParts = localeId?.split('_');
			if (localeParts) {
				languageMatch = this.#availableLanguages.find((x) => x === localeParts[0]);
			}
		}

		return languageMatch ?? this.#defaultLanguage;
	}

	#editorSetup(editor: Editor) {
		// initialise core plugins
		new TinyMceCodeEditorPlugin(editor, this.modalContext);
		new TinyMceLinkPickerPlugin(editor, this.modalContext, this.configuration);
		new TinyMceMacroPlugin(editor, this.modalContext);
		new TinyMceMediaPickerPlugin(editor, this.modalContext, this.configuration, this.currentUser);
		new TinyMceEmbeddedMediaPlugin(editor, this.modalContext);

		editor.suffix = '.min';

		// register custom option maxImageSize
		editor.options.register('maxImageSize', { processor: 'number', default: this.#fallbackConfig.maxImageSize });

		// If we can not find the insert image/media toolbar button
		// Then we need to add an event listener to the editor
		// That will update native browser drag & drop events
		// To update the icon to show you can NOT drop something into the editor
		if (this._configObject.toolbar && !this.#isMediaPickerEnabled()) {
			// Wire up the event listener
			editor.on('dragstart dragend dragover draggesture dragdrop drop drag', (e: EditorEvent<InputEvent>) => {
				e.preventDefault();
				if (e.dataTransfer) {
					e.dataTransfer.effectAllowed = 'none';
					e.dataTransfer.dropEffect = 'none';
				}
				e.stopPropagation();
			});
		}

		editor.addShortcut('Ctrl+S', '', () => this.dispatchEvent(new CustomEvent('rte.shortcut.save')));
		editor.addShortcut('Ctrl+P', '', () => this.dispatchEvent(new CustomEvent('rte.shortcut.saveAndPublish')));

		editor.on('init', () => this.#onInit(editor));
		editor.on('focus', () => this.dispatchEvent(new CustomEvent('umb-rte-focus', { composed: true, bubbles: true })));
		editor.on('blur', () => {
			this.#onChange(editor.getContent());
			this.dispatchEvent(new CustomEvent('umb-rte-blur', { composed: true, bubbles: true }));
		});
		editor.on('Change', () => this.#onChange(editor.getContent()));
		editor.on('Dirty', () => this.#onChange(editor.getContent()));
		editor.on('Keyup', () => this.#onChange(editor.getContent()));
		editor.on('SetContent', () => this.#mediaHelper.uploadBlobImages(editor));
		editor.on('ObjectResized', (e) => {
			this.#mediaHelper.onResize(e);
			this.#onChange(editor.getContent());
		});
	}

	#onInit(editor: Editor) {
		//enable browser based spell checking
		editor.getBody().setAttribute('spellcheck', 'true');

		/** Setup sanitization for preventing injecting arbitrary JavaScript execution in attributes:
		 * https://github.com/advisories/GHSA-w7jx-j77m-wp65
		 * https://github.com/advisories/GHSA-5vm8-hhgr-jcjp
		 */
		const uriAttributesToSanitize = [
			'src',
			'href',
			'data',
			'background',
			'action',
			'formaction',
			'poster',
			'xlink:href',
		];

		const parseUri = (function () {
			// Encapsulated JS logic.
			const safeSvgDataUrlElements = ['img', 'video'];
			const scriptUriRegExp = /((java|vb)script|mhtml):/i;
			// eslint-disable-next-line no-control-regex
			const trimRegExp = /[\s\u0000-\u001F]+/g;

			const isInvalidUri = (uri: string, tagName: string) => {
				if (/^data:image\//i.test(uri)) {
					return safeSvgDataUrlElements.indexOf(tagName) !== -1 && /^data:image\/svg\+xml/i.test(uri);
				} else {
					return /^data:/i.test(uri);
				}
			};

			return function parseUri(uri: string, tagName: string) {
				uri = uri.replace(trimRegExp, '');
				try {
					// Might throw malformed URI sequence
					uri = decodeURIComponent(uri);
				} catch (ex) {
					// Fallback to non UTF-8 decoder
					uri = unescape(uri);
				}

				if (scriptUriRegExp.test(uri)) {
					return;
				}

				if (isInvalidUri(uri, tagName)) {
					return;
				}

				return uri;
			};
		})();

		if (window.Umbraco?.Sys.ServerVariables.umbracoSettings.sanitizeTinyMce) {
			uriAttributesToSanitize.forEach((attribute) => {
				editor.serializer.addAttributeFilter(attribute, (nodes: AstNode[]) => {
					nodes.forEach((node: AstNode) => {
						node.attributes?.forEach((attr) => {
							if (uriAttributesToSanitize.includes(attr.name.toLowerCase())) {
								attr.value = parseUri(attr.value, node.name) ?? '';
							}
						});
					});
				});
			});
		}
	}

	#onChange(value: string) {
		super.value = value;
		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
	}

	#isMediaPickerEnabled() {
		return this._configObject.toolbar.includes('umbmediapicker');
	}

	render() {
		return html` <tinymce-editor config="tinyConfig">${this.value}</tinymce-editor>`;
	}
}

export default UmbInputTinyMceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-tiny-mce': UmbInputTinyMceElement;
	}
}
