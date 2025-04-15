/**
 * @module evaluaterequirement.eval.test
 * Integration tests for the reviewAndImproveRequirement function.
 */
// Copyright (c) 2025 Jon Verrier

import { describe, it } from 'mocha';
import { expect } from 'expect';
import { extractCodeFencedContent } from '../src/EvaluateRequirement';

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

