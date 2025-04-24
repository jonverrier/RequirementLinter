# RequirementsLinter Source Code

## Module Summaries

### entry.ts
Core interface exports for the RequirementsLinter system. This file serves as the main entry point, exporting key interfaces and functions required by client applications. It provides access to requirement and user story evaluation functions, quick check validation, and the API type definitions needed for integration.

### Evaluate.ts
The core evaluation engine that analyzes and improves requirements and user stories using AI models. It implements functionality for evaluating specifications against best practices, breaking complex specifications into atomic statements, extracting structured content from model responses, and suggesting improvements for clarity, completeness, and testability.

### globals.d.ts
TypeScript declaration file that enables importing markdown files as modules, allowing the system to incorporate guidelines stored in markdown format directly into the codebase.

### PromptIds.ts
Contains constant definitions for prompt identifiers used throughout the system. These IDs reference specific prompts in the system that handle different aspects of requirement and user story analysis, including guideline checking, splitting complex requirements, and feasibility checking.

### QuickCheck.ts
Provides lightweight validation capabilities to quickly determine if text resembles a requirement or user story. It uses smaller language models for faster response times, making it suitable for real-time feedback during authoring. The module includes functions for both requirement and user story validation.