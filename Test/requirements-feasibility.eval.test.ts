import { expect } from 'expect';
import { describe, it } from 'mocha';
import { PromptInMemoryRepository, IPromptRepository, IPrompt, EModel, EModelProvider, ChatDriverFactory } from "promptrepository";
import prompts from '../Src/Prompts.json';
import { requirementsFeasibilityCheckerPromptId } from '../Src/PromptIds';

const typedPrompts = prompts as IPrompt[];

function extractResponse(response: string): string {
    // we expect just 'yes' or 'no', we'll trim, lowercase and remove punctuation from the response
    return response.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
}

async function evaluateRequirementFeasibility(promptRepo: IPromptRepository, statement: string): Promise<string> {
    const prompt = promptRepo.getPrompt(requirementsFeasibilityCheckerPromptId);
    const userPrompt = promptRepo.expandUserPrompt(prompt!, {
        statement: statement
    });

    const chatDriverFactory = new ChatDriverFactory();
    const chatDriver = chatDriverFactory.create(EModel.kMini, EModelProvider.kOpenAI);    

    const response = await chatDriver.getModelResponse(prompt!.systemPrompt, userPrompt);
    return extractResponse(response);
}

describe('Requirements Feasibility Tests', () => {
    const TEST_TIMEOUT = 30000;

    const promptRepo: IPromptRepository = new PromptInMemoryRepository(typedPrompts);

    // Test 1: Clear requirement statement that should return "yes"
    it('should identify a clear requirement statement', async () => {
        const input = "The Formula 1 car shall maintain a minimum fuel level of 1.0 liters after completing the race.";
        const response = await evaluateRequirementFeasibility(promptRepo, input);
        expect(response).toBe("yes");
    }).timeout(TEST_TIMEOUT);

    // Test 2: Similar requirement with different values but same structure
    it('should identify a similar requirement with different values', async () => {
        const input = "The Formula 1 car shall maintain a minimum fuel level of 0.5 liters after completing the race.";
        const response = await evaluateRequirementFeasibility(promptRepo, input);
        expect(response).toBe("yes");
    }).timeout(TEST_TIMEOUT);

    // Test 3: Non-requirement statement that should return "no"
    it('should reject a non-requirement statement', async () => {
        const input = "Formula 1 cars are really fast and exciting to watch during the race.";
        const response = await evaluateRequirementFeasibility(promptRepo, input);
        expect(response).toBe("no");
    }).timeout(TEST_TIMEOUT);
});