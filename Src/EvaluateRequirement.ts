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
// Copyright (c) 2025 Jon Verrier

import path from "path";
import fs from "fs";

import { EModel, EModelProvider, ChatDriverFactory, IPrompt, PromptInMemoryRepository, InvalidParameterError } from "promptrepository";
import { requirementsGuidelineCheckerPromptId, requirementsSplitterPromptId } from './PromptIds';
import prompts from './Prompts.json';

const typedPrompts = prompts as IPrompt[];

const guidelines = fs.readFileSync(path.join(__dirname, './RequirementsGuidelines.md'), 'utf-8');

export interface IRequirementEvaluationRequest {
   requirement: string;
}

export interface IRequirementEvaluation {
   evaluation: string;
   proposedNewRequirement: string;
}

/**
 * Extracts all text except code-fenced content from a given response string.
 * 
 * @param response - The response string containing code-fenced content.
 * @returns The text outside of code fences or an empty string if no content is found.
 */
export function extractNonCodeFencedContent(response: string): string {
   // Remove all code-fenced blocks
   const withoutCodeBlocks = response.replace(/```(?:code|plaintext|requirement)?\s*[\s\S]*?```/g, '');

   // Trim and return the remaining text
   let result = withoutCodeBlocks ? withoutCodeBlocks.trim() : '';
   return result;
}

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

/**
 * Improves a requirement using a specified prompt and parameters.
 * 
 * @param promptId - The ID of the prompt to use for improvement
 * @param params - Key-value pairs of parameters to be expanded in the prompt
 * @returns A promise resolving to the improved requirement extracted from code-fenced content
 */
export async function improveRequirementWithPrompt(
   promptId: string,
   params: { [key: string]: string }
): Promise<IRequirementEvaluation> {
   // Load & expend the prompt
   const promptRepo = new PromptInMemoryRepository(typedPrompts);
   const prompt = promptRepo.getPrompt(promptId);
   const userPrompt = promptRepo.expandUserPrompt(prompt!, params);

   // Get the response from the model
   const chatDriverFactory = new ChatDriverFactory();
   const chatDriver = chatDriverFactory.create(EModel.kLarge, EModelProvider.kOpenAI);
   const response = await chatDriver.getModelResponse(prompt!.systemPrompt, userPrompt);

   return {
      evaluation: extractNonCodeFencedContent(response),
      proposedNewRequirement: extractCodeFencedContent(response)
   };
}


/**
 * Evaluates a requirement against the standard guidelines.
 * 
 * @param requirement - The requirement to be evaluated.
 * @param wordCount - The word count to use to generate comments on the requirement.
 * @returns A promise resolving to the evaluated requirement.
 */
export async function improveRequirement(requirement: string, wordCount: number): Promise<IRequirementEvaluation> {

   if (!requirement || requirement.trim().length === 0) {
      throw new InvalidParameterError('InvalidParameter: Requirement cannot be empty');
   }
   if (!wordCount || wordCount <= 0) {
      throw new InvalidParameterError('InvalidParameter: Word count must be greater than 0');
   }

   let evaluation = await improveRequirementWithPrompt(requirementsGuidelineCheckerPromptId, {
      guidelines: guidelines,
      requirement: requirement,
      wordCount: wordCount.toString()
   })

   return evaluation;
}


/**
 * Updates a requirement if necessaryby splitting it into atomic statements.
 * 
 * @param requirement - The requirement to be evaluated.
 * @returns A promise resolving to the evaluated requirement.
 */
export async function improveRequirementSplit(requirement: string): Promise<IRequirementEvaluation> {
   let evaluation = await improveRequirementWithPrompt(requirementsSplitterPromptId, {
      requirement: requirement
   });

   return evaluation;
}

/**
 * Evaluates a requirement against the standard guidelines.
 * 
 * @param requirement - The requirement to be evaluated.
 * @param wordCount - The word count to use to generate comments on the requirement.
 * @returns A promise resolving to the evaluated requirement.
 */
export async function evaluateRequirement(request: IRequirementEvaluationRequest): Promise<IRequirementEvaluation> {

   let wordCount: number = request.requirement.length * 5;

   const improvedRequirement = await improveRequirement(request.requirement, wordCount);
   let splitRequirement = await improveRequirementSplit(improvedRequirement.proposedNewRequirement);

   return {
      evaluation: improvedRequirement.evaluation,
      proposedNewRequirement: splitRequirement.proposedNewRequirement
   }
}