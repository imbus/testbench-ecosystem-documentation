# testbench-ecosystem-documentation
This repo hosts the documentation of several TestBench Ecosystem projects

## Maintaining this documentation site

This repository is a single Docusaurus site hosting multiple, independent docs sets (“tools”) via the multi-instance docs plugin.

- Global docs live under `docusaurus/docs/` (route: `docusaurus/docs/...`).
- Each tool has its own docs instance (route: `docusaurus/<tool-id>/...`).

### Add a new tool to the Ecosystem dropdown

The navbar “Ecosystem” dropdown is generated automatically by scanning for tool sidebars.

To add a new tool, you only need:

1. Create a new docs folder at `docusaurus/<tool-id>/`.
2. Add an `intro` doc at `docusaurus/<tool-id>/intro.md`.
3. Add a sidebar file `docusaurus/sidebars_<tool-id>.ts`.

That’s it: the tool will be discovered and appear in the Ecosystem dropdown automatically.

Notes:

- `<tool-id>` must be consistent across folder name and sidebar filename.
- The tool’s base route is `/<tool-id>/`.

### Maintain versions for a tool

Each tool docs instance has its own versioning lifecycle.

For non-default docs instances (all tools), Docusaurus stores versions in instance-specific paths:

- `docusaurus/<tool-id>_versions.json`
- `docusaurus/<tool-id>_versioned_docs/`
- `docusaurus/<tool-id>_versioned_sidebars/`

Example (CLI Reporter):

- `docusaurus/testbench-cli-reporter_versions.json`
- `docusaurus/testbench-cli-reporter_versioned_docs/`
- `docusaurus/testbench-cli-reporter_versioned_sidebars/`

#### Tag a new version

From the `docusaurus/` folder, run:

```bash
npm run docusaurus -- docs:version:<tool-id> <new-version>
```

Example:

```bash
npm run docusaurus -- docs:version:testbench-cli-reporter 0.0.3
```

This will:

- snapshot the current docs from `docusaurus/<tool-id>/` into `docusaurus/<tool-id>_versioned_docs/version-<new-version>/`
- create/update the versioned sidebars under `docusaurus/<tool-id>_versioned_sidebars/`
- prepend `<new-version>` to `docusaurus/<tool-id>_versions.json`

#### Update the “current” (unreleased) docs

Edit files under `docusaurus/<tool-id>/`. These changes apply to the “current” version (the next version you will tag).

#### Version dropdown in the navbar

The version dropdown is controlled via a navbar item of type `docsVersionDropdown` with a `docsPluginId`.

This site currently shows a version dropdown for the CLI Reporter docs instance.

If you want a version dropdown for another tool too, add another navbar item with that tool’s `docsPluginId`.

### Troubleshooting

- Tool doesn’t appear in the Ecosystem dropdown:
	- ensure `docusaurus/sidebars_<tool-id>.ts` exists
	- ensure `docusaurus/<tool-id>/` exists and is a folder
	- ensure `docusaurus/<tool-id>/intro.md` exists (the dropdown links to `intro`)