# Architecture rules

- Keep rich-content tools sticky beneath the dashboard header and insert media through a portalled dialog with a saved editor selection, so long articles can be edited without losing the insertion position.
- Reuse MediaPicker's inline library inside image dialogs instead of nesting media modals, so focus and scroll remain managed by one dialog.