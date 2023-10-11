import type { ManifestApi } from '@umbraco-cms/backoffice/extension-api';
// TODO: Consider adding a ClassType for this manifest. (Currently we cannot know the scope of a repository, therefor we are going with unknown for now.)
export interface ManifestRepository extends ManifestApi<unknown> {
	type: 'repository';
}
