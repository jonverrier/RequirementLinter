/**
 * @module entry
 * 
 * Core interfaces and types for the WorkBench system.
 */
// Copyright (c) 2025 Jon Verrier

export {
    IRequirementEvaluation,
    IRequirementEvaluationRequest,
    IQuickCheckResponse,
    IQuickCheckRequest
} from "../export/RequirementsLinterApiTypes";

export { evaluateRequirement} from "./EvaluateRequirement";
export { quickCheckLooksLikeRequirement } from "./QuickCheck";







