## Context

The congratulations overlay is a full-screen modal that appears when all tasks are completed. It currently lacks a dismiss action, which can leave users feeling stuck in the modal.

## Goals / Non-Goals

**Goals:**
- Provide two intuitive dismissal paths: a close control on the card and a click on the overlay background.
- Keep the change limited to frontend behavior and styling.

**Non-Goals:**
- No changes to backend APIs, data storage, or task completion logic.
- No new modal framework or large UI refactor.

## Decisions

- Add an explicit close button in the card header area to provide a clear affordance.
- Treat clicks on the overlay background as dismiss actions, while preventing clicks within the card from bubbling to the overlay.
- Use a parent-owned visibility state with an `onDismiss` callback from `Congratulations` to keep state management centralized and predictable.

## Risks / Trade-offs

- Accidental dismiss when clicking outside the card is possible. Mitigation: only close on overlay click and stop propagation from the card.
- Accessibility concerns if the control is not discoverable. Mitigation: use a semantic `button` with an accessible label and visible focus styling.
