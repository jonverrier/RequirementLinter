/**
 * @module entry
 * 
 * Core interfaces and types for the WorkBench system.
 */
// Copyright (c) 2025 Jon Verrier

export {
    ISpecificationEvaluation,
    ISpecificationEvaluationRequest,
    IQuickCheckResponse,
    IQuickCheckRequest
} from "../export/RequirementsLinterApiTypes";

export { evaluateRequirement, evaluateUserStory } from "./Evaluate";
export { quickCheckLooksLikeRequirement, quickCheckLooksLikeUserStory } from "./QuickCheck";







