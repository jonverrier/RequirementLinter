/**
 * @module EvaluateRequirement
 * 
 * Core functions for evaluating and improving requirements using AI models.
 * Provides functionality for:
 * - Splitting complex requirements into atomic statements
 * - Extracting code-fenced content from model responses
 * - Evaluating requirements against standard guidelines
 * - Improving requirement clarity and structure
 */

import path from "path";
import fs from "fs";

import { EModel, EModelProvider, ChatDriverFactory, IPrompt, PromptInMemoryRepository } from "promptrepository";
import { requirementsGuidelineCheckerPromptId, requirementsSplitterPromptId } from '../Src/PromptIds';
import prompts from '../Src/Prompts.json';

const typedPrompts = prompts as IPrompt[];

const guidelines = fs.readFileSync(path.join(__dirname, '../Src/RequirementsGuidelines.md'), 'utf-8');

/**
 * Extracts code-fenced content from a given response string.
 * 
 * @param response - The response string containing code-fenced content.
 * @returns The extracted code-fenced content or an empty string if no content is found.
 */
export function extractCodeFencedContent(response: string): string {
    const codeBlocks = response.match(/```(?:code|plaintext|requirement)?\s*([\s\S]*?)```/g);
    const codeBlockMatch = codeBlocks ? codeBlocks.map(block => {
        const content = block.match(/```(?:code|plaintext|requirement)?\s*([\s\S]*?)```/);
        return content ? content[1] : '';
    }).join('\n').trim() : null;
    
    let result = codeBlockMatch ? codeBlockMatch.trim() : '';
    return result;
}


export async function improveRequirementWithPrompt(requirement: string, promptId: string, params: { [key: string]: string }): Promise<string> {
    // Load & expend the prompt
    const promptRepo = new PromptInMemoryRepository(typedPrompts);
    const prompt = promptRepo.getPrompt(promptId);

    const userPrompt = promptRepo.expandUserPrompt(prompt!, params);

    const chatDriverFactory = new ChatDriverFactory();
    const chatDriver = chatDriverFactory.create(EModel.kLarge, EModelProvider.kOpenAI);    

    const response = await chatDriver.getModelResponse(prompt!.systemPrompt, userPrompt);
    return extractCodeFencedContent(response);
}


/**
 * Evaluates a requirement against the standard guidelines.
 * 
 * @param requirement - The requirement to be evaluated.
 * @param wordCount - The word count to use to generate comments on the requirement.
 * @returns A promise resolving to the evaluated requirement.
 */
export async function improveRequirement(requirement: string, wordCount: number): Promise<string> {


    return improveRequirementWithPrompt(requirement, requirementsGuidelineCheckerPromptId, {
      guidelines: guidelines,
      requirement: requirement,
      wordCount: wordCount.toString()
   });
}


/**
 * Updates a requirement if necessaryby splitting it into atomic statements.
 * 
 * @param requirement - The requirement to be evaluated.
 * @returns A promise resolving to the evaluated requirement.
 */
export async function improveRequirementSplit(requirement: string): Promise<string> {
    return improveRequirementWithPrompt(requirement, requirementsSplitterPromptId, {  
      requirement: requirement
    });
}

