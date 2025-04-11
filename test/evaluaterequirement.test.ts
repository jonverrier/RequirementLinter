/**
 * @module evaluaterequirement.eval.test
 * Integration tests for the reviewAndImproveRequirement function.
 */
// Copyright (c) 2025 Jon Verrier

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { extractCodeFencedContent, evaluateRequirement } from '../src/EvaluateRequirement';

describe('extractCodeFencedContent Unit Tests', () => {
    it('should extract content from a single code block', () => {
        // Arrange
        const input = '```\nThis is a test\n```';
        
        // Act
        const result = extractCodeFencedContent(input);
        
        // Assert
        expect(result).toBe('This is a test');
    });

    it('should extract content from multiple code blocks', () => {
        // Arrange
        const input = '```\nFirst block\n```\nSome text\n```\nSecond block\n```';
        
        // Act
        const result = extractCodeFencedContent(input);
        
        // Assert
        expect(result).toBe('First block\n\nSecond block');
    });

    it('should handle code blocks with language specifiers', () => {
        // Arrange
        const input = '```code\nTest code\n```\n```plaintext\nTest text\n```';
        
        // Act
        const result = extractCodeFencedContent(input);
        
        // Assert
        expect(result).toBe('Test code\n\nTest text');
    });

    it('should handle empty code blocks', () => {
        // Arrange
        const input = '```\n```';
        
        // Act
        const result = extractCodeFencedContent(input);
        
        // Assert
        expect(result).toBe('');
    });

    it('should return empty string when no code blocks are present', () => {
        // Arrange
        const input = 'This is just regular text';
        
        // Act
        const result = extractCodeFencedContent(input);
        
        // Assert
        expect(result).toBe('');
    });

    it('should handle code blocks with requirement language specifier', () => {
        // Arrange
        const input = '```requirement\nTest requirement\n```';
        
        // Act
        const result = extractCodeFencedContent(input);
        
        // Assert
        expect(result).toBe('Test requirement');
    });
});

const SESSION_ID = '1234567890';

describe('evaluateRequirement Integration Tests', () => {
    // Increase timeout for API calls
    const TEST_TIMEOUT = 30000; // 30 seconds as we have a large prompt with all the requirements

    it('should improve and split a simple requirement', async () => {
        // Arrange
        const inputRequirement = 'The system must handle user authentication';

        // Act
        const result = await evaluateRequirement({ requirement: inputRequirement, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewRequirement.length).toBeGreaterThan(0);
    }).timeout(TEST_TIMEOUT);

    it('should handle a complex requirement', async () => {
        // Arrange
        const inputRequirement = 'The system must handle user authentication, perform data validation, and ensure proper error handling while maintaining high performance and scalability';

        // Act
        const result = await evaluateRequirement({ requirement: inputRequirement, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewRequirement.length).toBeGreaterThan(0);
        // Complex requirements should be split into multiple lines
        expect(result.proposedNewRequirement.split('\n').length).toBeGreaterThan(1);
    }).timeout(TEST_TIMEOUT);

    it('should handle empty input', async () => {
        // Arrange
        const inputRequirement = '';

        // Act
        await expect(evaluateRequirement({ requirement: inputRequirement, sessionId: SESSION_ID }))
            .rejects
            .toThrow();
    }).timeout(TEST_TIMEOUT);

    it('should handle very short requirements', async () => {
        // Arrange
        const inputRequirement = 'Must be fast';

        // Act
        const result = await evaluateRequirement({ requirement: inputRequirement, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewRequirement.length).toBeGreaterThan(0);
        // Improved version should be more detailed
        expect(result.proposedNewRequirement.length).toBeGreaterThan(inputRequirement.length);
    }).timeout(TEST_TIMEOUT);

    it('should handle requirements with special characters', async () => {
        // Arrange
        const inputRequirement = 'System must handle UTF-8 characters like: é, ñ, 漢字';

        // Act
        const result = await evaluateRequirement({ requirement: inputRequirement, sessionId: SESSION_ID });

        // Assert
        expect(result.evaluation.length).toBeGreaterThan(0);
        expect(result.proposedNewRequirement.length).toBeGreaterThan(0);
    }).timeout(TEST_TIMEOUT);
});