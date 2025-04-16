/**
 * @module evaluateuserstory.eval.test
 * Integration tests for the evaluateUserStory function.
 */
// Copyright (c) 2025 Jon Verrier

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { evaluateUserStory } from '../src/Evaluate';

const SESSION_ID = '1234567890';

describe('evaluateUserStory Integration Tests', () => {
    // Increase timeout for API calls
    const TEST_TIMEOUT = 30000; // 30 seconds as we have a large prompt with all the requirements

    it('should improve a simple user story', async () => {
        // Arrange
        const inputUserStory = 'As a user, I want to log in so that I can access my account';

        // Act
        const result = await evaluateUserStory({ specification: inputUserStory, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewSpecification.length).toBeGreaterThan(0);
    }).timeout(TEST_TIMEOUT);

    it('should handle a complex user story', async () => {
        // Arrange
        const inputUserStory = 'As a customer, I want to be able to view my order history, track shipments, and manage my payment methods so that I can have better control over my shopping experience';

        // Act
        const result = await evaluateUserStory({ specification: inputUserStory, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewSpecification.length).toBeGreaterThan(0);
        // Complex user stories should be split into multiple stories
        expect(result.proposedNewSpecification.split('\n').length).toBeGreaterThan(1);
    }).timeout(TEST_TIMEOUT);

    it('should handle empty input', async () => {
        // Arrange
        const inputUserStory = '';

        // Act
        await expect(evaluateUserStory({ specification: inputUserStory, sessionId: SESSION_ID }))
            .rejects
            .toThrow();
    }).timeout(TEST_TIMEOUT);

    it('should handle very short user stories', async () => {
        // Arrange
        const inputUserStory = 'I want to login';

        // Act
        const result = await evaluateUserStory({ specification: inputUserStory, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewSpecification.length).toBeGreaterThan(0);
        // Improved version should be more detailed and follow user story format
        expect(result.proposedNewSpecification).toMatch(/As a .* I want to .* so that .*/);
    }).timeout(TEST_TIMEOUT);

    it('should handle user stories with special characters', async () => {
        // Arrange
        const inputUserStory = 'As a user, I want to use special characters like: é, ñ, 漢字 in my profile';

        // Act
        const result = await evaluateUserStory({ specification: inputUserStory, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewSpecification.length).toBeGreaterThan(0);
    }).timeout(TEST_TIMEOUT);

    it('should handle user stories with acceptance criteria', async () => {
        // Arrange
        const inputUserStory = 'As a user, I want to reset my password so that I can regain access to my account. Acceptance Criteria: The user can reset their password by clicking the reset password link in the login page.';

        // Act
        const result = await evaluateUserStory({ specification: inputUserStory, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewSpecification.length).toBeGreaterThan(0);
        // Should maintain or improve the acceptance criteria
        expect(result.proposedNewSpecification.toLowerCase()).toContain('acceptance criteria');
    }).timeout(TEST_TIMEOUT);
}); 