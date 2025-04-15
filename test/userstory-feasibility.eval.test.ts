/**
 * @module userstory-feasibility.eval.test
 * Integration tests for the evaluateUserStory function.
 */
// Copyright (c) 2025 Jon Verrier

import { expect } from 'expect';
import { describe, it } from 'mocha';
import { PromptInMemoryRepository, IPromptRepository, IPrompt, EModel, EModelProvider, ChatDriverFactory } from "prompt-repository";
import prompts from '../src/Prompts.json';
import { userStoryFeasibilityCheckerPromptId } from '../src/PromptIds';

const typedPrompts = prompts as IPrompt[];

function extractResponse(response: string): string {
    // we expect just 'yes' or 'no', we'll trim, lowercase and remove punctuation from the response
    return response.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
}

async function evaluateUserStory(promptRepo: IPromptRepository, story: string): Promise<string> {
    const prompt = promptRepo.getPrompt(userStoryFeasibilityCheckerPromptId);
    const userPrompt = promptRepo.expandUserPrompt(prompt!, {
        statement: story
    });

    const chatDriverFactory = new ChatDriverFactory();
    const chatDriver = chatDriverFactory.create(EModel.kMini, EModelProvider.kOpenAI);    

    const response = await chatDriver.getModelResponse(prompt!.systemPrompt, userPrompt);
    return extractResponse(response);
}

describe('User Story Feasibility Tests', () => {
    const TEST_TIMEOUT = 30000;

    const promptRepo: IPromptRepository = new PromptInMemoryRepository(typedPrompts);

    // Test 1: Clear user story that should return "yes"
    it('should identify a clear user story', async () => {
        const input = "As a Race Engineer, I want to monitor the tire temperature to ensure it stays between 80-100°C during the race.";
        const response = await evaluateUserStory(promptRepo, input);
        expect(response).toBe("yes");
    }).timeout(TEST_TIMEOUT);

    // Test 2: Similar user story with different values but same structure
    it('should identify a similar user story with different values', async () => {
        const input = "As a Race Engineer, I want to monitor the tire temperature to ensure it stays between 75-95°C during the race.";
        const response = await evaluateUserStory(promptRepo, input);
        expect(response).toBe("yes");
    }).timeout(TEST_TIMEOUT);

    // Test 3: Non-user story statement that should return "no"
    it('should reject a non-user story statement', async () => {
        const input = "I love looking at the tires on an F1 car.";
        const response = await evaluateUserStory(promptRepo, input);
        expect(response).toBe("no");
    }).timeout(TEST_TIMEOUT);
}); 