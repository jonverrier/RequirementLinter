/**
 * @module requirements-splitter.eval.test
 * Integration tests for the evaluateRequirementSplit function.
 */
// Copyright (c) 2025 Jon Verrier

import { expect } from 'expect';
import { describe, it } from 'mocha';
import { improveRequirementSplit } from '../src/EvaluateRequirement';

describe('Requirements Splitter Tests', () => {
    const TEST_TIMEOUT = 30000;

    // Test 1: Simple single requirement that should not be split
    it('should not split a simple single requirement', async () => {
        const input = "The vehicle's engine oil shall operate at a minimum temperature of 80°C.";
        const response = await improveRequirementSplit(input);
        
        // Should have single "shall/must" statements      
        const shallCount = (response.proposedNewRequirement.toLowerCase().match(/(shall|must)/g) || []).length;
        expect(shallCount).toEqual(1);        
    }).timeout(TEST_TIMEOUT);

    // Test 2: Similar requirement with different wording but same meaning
    it('should handle equivalent requirement with different wording', async () => {
        const input = "The vehicle's engine oil shall operate at a minimum temperature of 90°C.";
        const response = await improveRequirementSplit(input);
        
        // Should have single "shall/must" statements       
        const shallCount = (response.proposedNewRequirement.toLowerCase().match(/(shall|must)/g) || []).length;
        expect(shallCount).toEqual(1);
    }).timeout(TEST_TIMEOUT);

    // Test 3: Complex requirement that should be split
    it('should split compound requirements', async () => {
        const input = "The vehicle's engine oil shall operate at a minimum temperature of 80°C and the Speedometer shall display speed in kph.";
        const response = await improveRequirementSplit(input);      

        // Should have multiple "shall/must" statements
        const shallCount = (response.proposedNewRequirement.toLowerCase().match(/(shall|must)/g) || []).length;
        console.log(response.proposedNewRequirement);
        expect(shallCount).toBeGreaterThan(1);
    }).timeout(TEST_TIMEOUT);
});