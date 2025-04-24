## IPrompt interface should require schemaversion field for future compatibility

### Description
The IPrompt interface should formally require a "schemaversion" field to ensure future versions of prompts can be upgraded on the fly. This would allow for schema evolution and backward compatibility as the application evolves.

### Current Status
The Prompts.json file already includes a "schemaversion" field (currently set to "0.1") for each prompt definition, but we should ensure this is a formal requirement in the IPrompt interface.

### Requirements
- Ensure the "schemaversion" field is mandatory in the IPrompt interface
- Document the purpose of this field in comments
- Implement version checking when loading prompts to handle potential future schema migrations

### Benefits
- Enables seamless upgrades of stored prompts when the schema changes
- Provides a clear migration path for older prompt configurations
- Improves system maintainability over time

### Implementation Notes
This should be a straightforward change to the TypeScript interface definition, with version checking logic added to prompt loading code. 