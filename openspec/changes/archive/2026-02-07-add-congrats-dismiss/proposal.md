## Why

Users need a quick, intuitive way to dismiss the congratulations overlay when they are done viewing it. Right now the overlay has no direct dismissal affordance, which can make the UI feel stuck.

## What Changes

- Add a close control on the congratulations card to dismiss the overlay.
- Allow clicking outside the card (overlay background) to dismiss the overlay.
- No breaking changes.

## Capabilities

### New Capabilities
- `congrats-dismiss`: Dismissal interactions for the congratulations overlay via close control and outside click.

### Modified Capabilities
- 

## Impact

- Frontend component: congratulations overlay and styling.
- No backend, API, or database changes.
