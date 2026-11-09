# Architecture rules

- Keep rich-content tools sticky beneath the dashboard header and insert media through a portalled dialog with a saved editor selection, so long articles can be edited without losing the insertion position.
- Reuse MediaPicker's inline library inside image dialogs instead of nesting media modals, so focus and scroll remain managed by one dialog.
- Generate static social-share HTML and optimized thumbnails from published articles during site builds; share controls use the generated manifest, so non-JavaScript social crawlers get article-specific metadata without migrating the SPA. Publish again after changing article titles or photos to refresh these static previews.