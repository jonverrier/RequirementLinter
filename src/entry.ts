/**
 * @module entry
 * 
 * Core interfaces and types for the WorkBench system.
 */
// Copyright (c) 2025 Jon Verrier

// ===Start StrongAI Generated Comment (20260314)===
// Entry module for the WorkBench requirements linter. It centralizes public types and functions so consumers can import from one place. It exposes the core API contracts alongside the primary analysis routines.
// 
// It re-exports four API types from RequirementsLinterApiTypes: ISpecificationEvaluation and ISpecificationEvaluationRequest define the shape of a full evaluation request and its corresponding result. IQuickCheckRequest and IQuickCheckResponse define the input and output for lightweight, fast checks. These types are the canonical wire format for callers and enforce consistent request and response payloads across the system.
// 
// It exports two full evaluation functions from Evaluate: evaluateRequirement runs a comprehensive analysis of a requirement statement, and evaluateUserStory does the same for user stories. These functions are intended for deeper, rule-based assessments and structured scoring or feedback.
// 
// It exports two quick check utilities from QuickCheck: quickCheckLooksLikeRequirement and quickCheckLooksLikeUserStory provide rapid heuristics to assess whether text conforms to expected patterns. Use this module as the single entry point to integrate linter capabilities.
// ===End StrongAI Generated Comment===


export {
    ISpecificationEvaluation,
    ISpecificationEvaluationRequest,
    IQuickCheckResponse,
    IQuickCheckRequest
} from "../export/RequirementsLinterApiTypes";

export { evaluateRequirement, evaluateUserStory } from "./Evaluate";
export { quickCheckLooksLikeRequirement, quickCheckLooksLikeUserStory } from "./QuickCheck";







