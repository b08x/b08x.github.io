# Goal: GitAgent Workbench Docs Collection

Set up a new `docs` collection within the `b08x.github.io` Jekyll site to host the documentation for the GitAgent Workbench project. This involves configuring the collection, setting up a central index and sidebar navigation, and creating a sync script to automatically pull the markdown files from the `gitagent-workbench` repository.

- **Facts**: [facts.md](facts.md)
- **Plan**: [plan.md](plan.md)

## Done Condition
The goal is complete when the `docs` collection is configured in Jekyll, a `/docs/` index page exists, the `doc.html` layout renders a sidebar based on `_data/docs_nav.yml`, and a script successfully copies documentation from `gitagent-workbench` into `b08x.github.io/_docs/gitagent-workbench/`.
