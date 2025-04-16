/**
 * @module QuickCheck
 * Provides functionality to quickly check if a given statement looks like a system requirement.
 * Uses AI to evaluate the statement against standard requirement criteria.
 */
// Copyright (c) 2025 Jon Verrier

import { IQuickCheckRequest, IQuickCheckResponse } from "../export/RequirementsLinterApiTypes";

import { ChatDriverFactory, EModel, EModelProvider, IPrompt, PromptInMemoryRepository, InvalidParameterError } from "prompt-repository";
import { requirementsFeasibilityCheckerPromptId, userStoryFeasibilityCheckerPromptId } from "./PromptIds";
import prompts from "./Prompts.json";
const typedPrompts = prompts as IPrompt[];

/**
 * Checks if a given statement looks like a system requirement.
 * @param request - The request query specification.
 * @returns True if the statement looks like a system requirement, false otherwise.
 */
export async function quickCheckLooksLikeRequirement (request: IQuickCheckRequest) : Promise<IQuickCheckResponse> {

    return await quickCheckLooksLikeRequirementWithPrompt(request, requirementsFeasibilityCheckerPromptId);
}

/**
 * Checks if a given statement looks like a system requirement.
 * @param request - The request query specification.
 * @returns True if the statement looks like a system requirement, false otherwise.
 */
export async function quickCheckLooksLikeUserStory (request: IQuickCheckRequest) : Promise<IQuickCheckResponse> {

   return await quickCheckLooksLikeRequirementWithPrompt(request, userStoryFeasibilityCheckerPromptId);
}

/**
 * Checks if a given statement looks like a system requirement using a specified prompt.
 * @param request - The request query specification.
 * @param promptId - The ID of the prompt to use for checking.
 * @returns True if the statement looks like a system requirement, false otherwise.
 */
async function quickCheckLooksLikeRequirementWithPrompt (request: IQuickCheckRequest, promptId: string) : Promise<IQuickCheckResponse> {

    if (!request.statement) {
        throw new InvalidParameterError("Statement is required.");
    }

    // Create a fast chat driver
    const chatDriverFactory = new ChatDriverFactory();
    const chatDriver = chatDriverFactory.create(EModel.kMini, EModelProvider.kOpenAI);  

    // Load & expend the prompt
    const promptRepo = new PromptInMemoryRepository(typedPrompts);
    const prompt = promptRepo.getPrompt(promptId);
    const userPrompt = promptRepo.expandUserPrompt(prompt!, {
      statement: request.statement
    });

    // Get the response from the AI
    const response = await chatDriver.getModelResponse(prompt!.systemPrompt, userPrompt);

    // Trim, lower case and remove punctuation from the response
    const trimmed = response.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    switch (trimmed) {
        case 'yes':
            return { isSpecification: true };
        case 'no':
            return { isSpecification: false };
        default:
         if (request.beFriendly) {
            return { isSpecification: true };
         }
         else {
            return { isSpecification: false };
         }
    }
}
