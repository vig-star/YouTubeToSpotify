# Contributing

Keep changes focused and describe what a user can observe before and after the change.

1. Follow the [local setup](README.md#local-setup) and create a branch for your change.
2. Keep real credentials in `.env`; never commit keys, tokens, personal playlist data, or provider responses containing account information.
3. Run `npm test -- --runInBand` and `npm run build`. Check the interface at desktop and mobile widths when changing styles.
4. Open a pull request with the change, validation results, and a screenshot for visible updates. State whether verification used local UI checks or real provider accounts.

Use two spaces for indentation and preserve the existing React/Express structure. Keep API migrations and new transfer features in separate changes from visual polish.
