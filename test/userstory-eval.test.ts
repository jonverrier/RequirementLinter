import { expect } from 'expect';
import { describe, it } from 'mocha';
import { evaluateUserStory } from '../src/Evaluate';
import { ISpecificationEvaluationRequest } from '../export/RequirementsLinterApiTypes';

const SESSION_ID = 'test-session-123';

describe('User Story Evaluation Tests', () => {

   const TEST_TIMEOUT = 30000; // 30 seconds as we have a large prompt with all the requirements

    const createRequest = (requirement: string): ISpecificationEvaluationRequest => ({
        specification: requirement,
        sessionId: SESSION_ID
    });

    it('Test Case 1: Missing Actor', async () => {
        const input = "I need to validate requirements so that quality is ensured.";
        const request = createRequest(input);
        
        const result = await evaluateUserStory(request);
        
        expect(result.evaluation.toLowerCase()).toContain('missing');
        expect(result.evaluation.toLowerCase()).toContain('actor');
    }).timeout(TEST_TIMEOUT);

    it('Test Case 2: Missing Goal', async () => {
        const input = "As a developer, I need to validate requirements.";
        const request = createRequest(input);
        
        const result = await evaluateUserStory(request);
        
        expect(result.evaluation.toLowerCase()).toContain('missing');
        expect(result.evaluation.toLowerCase()).toContain('goal');
    }).timeout(TEST_TIMEOUT);

    it('Test Case 3: Non-INVEST Compliant', async () => {
        const input = "As a team, we need to build everything in the system so users are happy.";
        const request = createRequest(input);
        
        const result = await evaluateUserStory(request);
        
        expect(result.evaluation.toLowerCase()).toMatch(/(violates|does not comply|does not adhere|fails to meet|does not meet)/);
    }).timeout(TEST_TIMEOUT);

    it('Test Case 4: Vague Terms', async () => {
        const input = "As a developer, I need an appropriate tool to efficiently validate many requirements.";
        const request = createRequest(input);
        
        const result = await evaluateUserStory(request);
        
        expect(result.evaluation.toLowerCase()).toContain('vague');
        expect(result.evaluation.toLowerCase()).toContain('terms');
    }).timeout(TEST_TIMEOUT);

    it('Test Case 5: Good Compliance', async () => {
        const input = "As a developer, I need to validate requirements so that I can ensure they meet quality standards. Acceptance criteria: I receive at least one suggestion to improve each user story I provide to the system. The system processes requirements in noi less than 30 seconds with a target of 10 seconds.";
        const request = createRequest(input);
        
        const result = await evaluateUserStory(request);
        
        expect(result.evaluation).not.toMatch(/(violates|does not adhere|does not comply|fails to meet|does not meet)/);
    }).timeout(TEST_TIMEOUT);
}); 