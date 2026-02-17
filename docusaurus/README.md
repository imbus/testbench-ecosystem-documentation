# Online Help System

The online help is built using [Docusaurus](https://docusaurus.io/).

## Setup of tools

1. Install Node.js
    - Download and install from https://nodejs.org/.

2. Install Mercurial from https://www.mercurial-scm.org/install

3. Install VS-Code from https://code.visualstudio.com/

4. Install VS-Code Plugins for Docusaurus/Markdown:

    - tomasdahlqvist.markdown-admonitions

    - mileskies.docusaurus-mdx-previewer

    - yzhang.markdown-all-in-one

    - shd101wyy.markdown-preview-enhanced

5. Clone the Testbench repository locally

6.
 ```
 cd subprojects/docusaurus
 npm install
 ```

## Editing the online help

1. ``` npm run start ```
   (to start a certain language add ```-- --locale fr```)

2. Open http://localhost:3000/ in the browser (to open a certain language add e.g. /fr/ to the url)



## Building the online help

1. ```
   npm run build
   npm run serve
   ```

2. Open http://localhost:3000/ in the browser

Info: The search and switching the language only works in the build application, but not in the editing mode with npm run start.

## Ecosystem tools (multi-instance docs)

This site hosts multiple documentation sets (“tools”) using Docusaurus docs multi-instance.

- Global docs: `docusaurus/docs/` (route: `/docs/...`)
- Tool docs: `docusaurus/<tool-id>/` (route: `/<tool-id>/...`)

### Add a new tool

Create:

1. `docusaurus/<tool-id>/intro.md`
2. `docusaurus/sidebars_<tool-id>.ts`

The navbar Ecosystem dropdown and the tool docs plugin instance are discovered automatically based on `sidebars_<tool-id>.ts`.

### Versioning a tool

Each tool docs instance has its own version storage:

- `docusaurus/<tool-id>_versions.json`
- `docusaurus/<tool-id>_versioned_docs/`
- `docusaurus/<tool-id>_versioned_sidebars/`

To tag a new version:

```bash
cd docusaurus
npm run docusaurus -- docs:version:<tool-id> <new-version>
```

Example:

```bash
npm run docusaurus -- docs:version:testbench-cli-reporter 0.0.3
```

Edit “current” docs at `docusaurus/<tool-id>/`.




# How to add content to online help

- Docusaurus has plugins for docs, blog and pages. More details can be found at [Routing](https://docusaurus.io/docs/advanced/routing).
- Additional to pure Markdown, also [MDX](https://mdxjs.com/) is supported. More details can be found at: [MDX and React](https://docusaurus.io/docs/markdown-features/react)
- A short introduction to Markdown and its syntax can be found here: [How to use Markdown for writing technical documentation](https://experienceleague.adobe.com/en/docs/contributor/contributor-guide/writing-essentials/markdown).
- Admonitions can be used for note/tip/info/warning/danger content-boxes. Details can be found at [Admonitions](https://docusaurus.io/docs/markdown-features/admonitions).

More general information can be found on the [online help confluence page]( https://testbenchcs.atlassian.net/wiki/spaces/TB/pages/801013762/Online+Help+System).



## Chapter structure and headings
The structure levels of the English and the corresponding German chapters have to be identical.
- The folders and file names of the markdown files should be in English for both versions.

### Headings and IDs
Headings in the German version should be in German. They should have an id that corresponds to the equivalent English title. Here is an example:

    English: ## Evaluation

    German: ## Bewertung {#evaluation}

Both can be linked to with ```<path_to_folder>/18_Preferences.md#evaluation```.

Here is more information about [Heading IDs](https://docusaurus.io/docs/next/markdown-features/toc#heading-ids).


### Chapters with only one markdown file
Chapters that consist of only one file should be located in the parent chapters folder. The filename should contain its position within the parent chapter, for example ```docs\Manual\TestBench_Client\Functions\19_Subdivisions.md``` is the 20th subchapter in Functions.
Chapter indexing starts at 0, where 0 usually is the introduction.

### Chapters with more than one markdown file
Chapters that consist of more than one markdown file are structured as a directory that contains all subchapter files. That folder also contains an additional file that contains the chapter introduction.

- This file is usually called ```00_Intruduction.md``` and exists in both English and German
- The English version also has a ```_category_.json``` file. Here is an example for how that file usually looks:
```json
{
    "label": "Controls",
    "position": 5,
    "link": {
        "type": "doc",
        "id": "Manual/iTORX/Controls/Introduction"
    }
}
```
- ```"label"```: Chapter title, should be the same as the folder name (content-wise), but the label can contain special characters and spaces that are not allowed in the folder name.
- ```"position"```: Position of this chapter in the parent chapter.
- ```"link" -> "id"```: Path to the introduction file. This is used to display the introduction page directly on the folder level, not as a subpage.

Here is more information about the ```_category_.json```: [Category item metadata](https://docusaurus.io/docs/next/sidebar/autogenerated#category-item-metadata).


## Images
- All images are saved in the image folders depending on the language of the document:
    - en: ```\docs\Manual\images```
    - de: ```\i18n\de\docusaurus-plugin-content-docs\current\Manual\images```

  For example:
  ```i18n\de\docusaurus-plugin-content-docs\current\Manual\images\Testfallbaum\img_6.png``` is image six in the German version of the chapter
- Link image:
    ```
    ![](<relative_path_to_image_folder>/images/<chapter>/<image_name>.png)
    ```

## Line breaks
Use HTML line breaks and avoid trailing spaces.

- Preferred: Use `<br/>` to force a line break in Markdown/MDX.
- Avoid: Two trailing spaces at the end of a line (Markdown soft-break) — this is error-prone, invisible in diffs, and inconsistent across editors.