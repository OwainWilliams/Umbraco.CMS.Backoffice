import { expect, fixture, html } from '@open-wc/testing';
//TODO: Test has been commented out while we figure out how to setup import maps for the test environment
// import { defaultA11yConfig } from '@umbraco-cms/test-utils';
// import UmbSectionViewUsersElement from './section-view-users.element';

// describe('UmbSectionViewUsersElement', () => {
// 	let element: UmbSectionViewUsersElement;
// 	beforeEach(async () => {
// 		element = await fixture(html`<umb-section-view-users></umb-section-view-users>`);
// 	});

// 	it('is defined with its own instance', () => {
// 		expect(element).to.be.instanceOf(UmbSectionViewUsersElement);
// 	});

// 	it('passes the a11y audit', async () => {
// 		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
// 	});
// });