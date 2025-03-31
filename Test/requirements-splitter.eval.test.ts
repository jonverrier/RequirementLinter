import { expect } from 'expect';
import { describe, it } from 'mocha';
import { PromptInMemoryRepository, IPromptRepository, IPrompt, EModel, EModelProvider, ChatDriverFactory } from "promptrepository";
import prompts from '../Src/Prompts.json';
import { requirementsSplitterPromptId } from '../Src/PromptIds';

const typedPrompts = prompts as IPrompt[];

function extractCodeFencedContent(response: string): string {
    const codeBlocks = response.match(/```(?:code|plaintext|requirement)?\s*([\s\S]*?)```/g);
    const codeBlockMatch = codeBlocks ? codeBlocks.map(block => {
        const content = block.match(/```(?:code|plaintext|requirement)?\s*([\s\S]*?)```/);
        return content ? content[1] : '';
    }).join('\n').trim() : null;
    
    let result = codeBlockMatch ? codeBlockMatch.trim() : '';
    return result;
}

async function evaluateRequirementSplit(promptRepo: IPromptRepository, requirement: string): Promise<string> {
    const prompt = promptRepo.getPrompt(requirementsSplitterPromptId);
    const userPrompt = promptRepo.expandUserPrompt(prompt!, {
        requirement: requirement
    });

    const chatDriverFactory = new ChatDriverFactory();
    const chatDriver = chatDriverFactory.create (EModel.kLarge, EModelProvider.kOpenAI);    

    const response = await chatDriver.getModelResponse(prompt!.systemPrompt, userPrompt);
    return extractCodeFencedContent(response);
}

describe('Requirements Splitter Tests', () => {
    const TEST_TIMEOUT = 30000;
    const promptRepo: IPromptRepository = new PromptInMemoryRepository(typedPrompts);

    // Test 1: Simple single requirement that should not be split
    it('should not split a simple single requirement', async () => {
        const input = "The vehicle's engine oil shall operate at a minimum temperature of 80°C.";
        const response = await evaluateRequirementSplit(promptRepo, input);
        
        // Should have single "shall/must" statements      
        const shallCount = (response.toLowerCase().match(/(shall|must)/g) || []).length;
        expect(shallCount).toEqual(1);        
    }).timeout(TEST_TIMEOUT);

    // Test 2: Similar requirement with different wording but same meaning
    it('should handle equivalent requirement with different wording', async () => {
        const input = "The vehicle's engine oil shall operate at a minimum temperature of 90°C.";
        const response = await evaluateRequirementSplit(promptRepo, input);
        
        // Should have single "shall/must" statements       
        const shallCount = (response.toLowerCase().match(/(shall|must)/g) || []).length;
        expect(shallCount).toEqual(1);
    }).timeout(TEST_TIMEOUT);

    // Test 3: Complex requirement that should be split
    it('should split compound requirements', async () => {
        const input = "The vehicle's engine oil shall operate at a minimum temperature of 80°C and the Speedometer shall display speed in kph.";
        const response = await evaluateRequirementSplit(promptRepo, input);      

        // Should have multiple "shall/must" statements
        const shallCount = (response.toLowerCase().match(/(shall|must)/g) || []).length;
        expect(shallCount).toBeGreaterThan(1);
    }).timeout(TEST_TIMEOUT);
});