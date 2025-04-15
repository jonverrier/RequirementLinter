/**
 * @module RequirementsLinterApiTypes
 * 
 * Type definitions and interfaces for the requirements linting API.
 * Includes types for requirement evaluation requests/responses and
 * quick requirement validation checks.
 */

// Copyright (c) 2025 Jon Verrier

export interface IQuickCheckRequest {
    statement: string;
    beFriendly?: boolean | undefined;
    sessionId: string;
}

export interface IQuickCheckResponse {
    isRequirement: boolean;
}

export interface IRequirementEvaluationRequest {
   requirement: string;
   sessionId: string;
}

export interface IRequirementEvaluation {
   evaluation: string;
   proposedNewRequirement: string;
}

/**
 * Interface for a user story evaluation request.
 */
export interface IUserStoryEvaluationRequest {
    /**
     * The user story to evaluate.
     */
    userStory: string;

    /**
     * The session ID for tracking the evaluation.
     */
    sessionId: string;
}

/**
 * Interface for a user story evaluation response.
 */
export interface IUserStoryEvaluation {
    /**
     * The evaluation of the user story.
     */
    evaluation: string;

    /**
     * The proposed new user story.
     */
    proposedNewUserStory: string;
}