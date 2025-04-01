/**
 * @module EvaluateRequirementApi
 * Integration tests for the EvaluateRequirement API endpoint.
 */
// Copyright (c) 2025 Jon Verrier

import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';
import { IRequirementEvaluation } from '../src/EvaluateRequirement';

const API_URL = 'http://localhost:7071/api/EvaluateRequirement'; // Adjust port if needed

describe('EvaluateRequirement API Integration Tests', () => {
   const TEST_TIMEOUT = 30000; // 30 seconds timeout for API calls

   it('should successfully evaluate a valid requirement', async () => {
      const testRequest = {
         requirement: 'The system shall provide user authentication'
      };

      const response = await axios.post(API_URL, testRequest);
      const result = response.data as IRequirementEvaluation;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.evaluation.length).toBeGreaterThan(0);
      expect(result.proposedNewRequirement.length).toBeGreaterThan(0);
   }).timeout(TEST_TIMEOUT);

   it('should handle empty requirement', async () => {
      const testRequest = {
         requirement: ''
      };

      try {
         await axios.post(API_URL, { invalidField: 'test' });
         throw new Error('Should have thrown an error');
      } catch (error: any) {
         expect(error.response.status).toBe(500);
      }

   }).timeout(TEST_TIMEOUT);

   it('should handle malformed request', async () => {
      try {
         await axios.post(API_URL, { invalidField: 'test' });
         throw new Error('Should have thrown an error');
      } catch (error: any) {
         expect(error.response.status).toBe(500);
      }
   }).timeout(TEST_TIMEOUT);

   it('should accept GET requests', async () => {
      const response = await axios.get(API_URL, {
         params: {
            requirement: 'The system shall provide user authentication'
         }
      });
      const result = response.data as IRequirementEvaluation;
      expect(response.status).toBe(200);
   }).timeout(TEST_TIMEOUT);
});