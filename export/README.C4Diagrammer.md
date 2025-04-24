# RequirementsLinter API Types

## Module Summary

### RequirementsLinterApiTypes.ts
Defines the core TypeScript interfaces used across the RequirementsLinter API, enabling proper type safety and integration points for client applications. This module contains four key interfaces:

1. `IQuickCheckRequest`: Defines the structure for quick validation requests, including the statement to check, a friendliness flag for handling ambiguous cases, and a session identifier.

2. `IQuickCheckResponse`: Simple response interface indicating whether a statement looks like a valid specification.

3. `ISpecificationEvaluationRequest`: Structure for detailed specification evaluation requests, containing the specification text and a session identifier.

4. `ISpecificationEvaluation`: Response interface for detailed evaluations, containing both a textual evaluation and a proposed improved specification.

These types serve as the contract between the RequirementsLinter library and consuming applications.