/**
 * @module RequirementsLinterApiTypes
 * 
 * Type definitions and interfaces for the requirements linting API.
 * Includes types for specification evaluation requests/responses and
 * quick specification validation checks.
 */

// Copyright (c) 2025 Jon Verrier

// ===Start StrongAI Generated Comment (20260314)===
// RequirementsLinterApiTypes defines TypeScript interfaces used by a requirements linting API. It standardizes payload shapes for quick checks and full specification evaluations across client, server, and tests.
// 
// IQuickCheckRequest models an ad-hoc, single-statement check. It carries the raw statement to analyze, a sessionId to correlate calls, and an optional beFriendly flag that can tune response tone or strictness.
// 
// IQuickCheckResponse reports the minimal outcome of a quick check with a single boolean, isSpecification, indicating whether the statement qualifies as a formal requirement or specification.
// 
// ISpecificationEvaluationRequest describes a full evaluation task. It includes the complete specification text and a sessionId for traceability.
// 
// ISpecificationEvaluation contains the richer results of that evaluation. evaluation holds narrative feedback, findings, or scores produced by the linter. proposedNewSpecification provides a rewritten version that addresses issues or clarifies intent.
// 
// No functions or classes are implemented here; this module only declares types to enable type-safe API contracts and serialization. There are no imports or external dependencies; consumers import these interfaces and implement the API behavior elsewhere.
// ===End StrongAI Generated Comment===


export interface IQuickCheckRequest {
   statement: string;
   beFriendly?: boolean | undefined;
   sessionId: string;
}

export interface IQuickCheckResponse {
   isSpecification: boolean;
}

export interface ISpecificationEvaluationRequest {
   specification: string;
   sessionId: string;
}

export interface ISpecificationEvaluation {
   evaluation: string;
   proposedNewSpecification: string;
}
