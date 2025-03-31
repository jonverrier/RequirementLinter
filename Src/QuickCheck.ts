/**
 * @module QuickCheck
 * Provides functionality to quickly check if a given statement looks like a system requirement.
 * Uses AI to evaluate the statement against standard requirement criteria.
 */
// Copyright (c) 2025 Jon Verrier

import { ChatDriverFactory, EModel, EModelProvider, IPrompt, PromptInMemoryRepository } from "promptrepository";
import { requirementsFeasibilityCheckerPromptId } from "../Src/PromptIds";
import prompts from '../Src/Prompts.json';
const typedPrompts = prompts as IPrompt[];
export async function quickCheckLooksLikeRequirement (statement: string, beFriendly: boolean = true) : Promise<boolean> {

    // Create a fast chat driver
    const chatDriverFactory = new ChatDriverFactory();
    const chatDriver = chatDriverFactory.create(EModel.kMini, EModelProvider.kOpenAI);  

    // Load & expend the prompt
    const promptRepo = new PromptInMemoryRepository(typedPrompts);
    const prompt = promptRepo.getPrompt(requirementsFeasibilityCheckerPromptId);
    const userPrompt = promptRepo.expandUserPrompt(prompt!, {
      statement: statement
    });

    // Get the response from the AI
    const response = await chatDriver.getModelResponse(prompt!.systemPrompt, userPrompt);

    // Trim, lower case and remove punctuation from the response
    const trimmed = response.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    switch (trimmed) {
        case 'yes':
            return true;
        case 'no':
            return false;
        default:
         if (beFriendly) {
            return true;
         }
         else {
            return false;
         }
    }
}
