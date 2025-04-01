

import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';
import { IQuickCheckRequest, IQuickCheckResponse } from '../src/QuickCheck';

const BASE_URL = 'http://localhost:7071/api'; // Adjust port if needed for local testing

describe('Quickcheck API Endpoint', () => {
    const endpoint = `${BASE_URL}/quickcheck`;
    const TEST_TIMEOUT = 30000; // 30 seconds timeout for API calls

    it('should check a valid requirement statement', async () => {
        const request: IQuickCheckRequest = {
            statement: 'The system shall provide user authentication',
            beFriendly: true
        };

        const response = await axios.post(endpoint, request);
        const result = response.data as IQuickCheckResponse;

        expect(response.status).toBe(200);
        expect(result).toHaveProperty('isRequirement');
    }).timeout(TEST_TIMEOUT);

    it('should handle empty statement', async () => {
        const request: IQuickCheckRequest = {
            statement: '',
            beFriendly: true
        };

        try {
            await axios.post(endpoint, request);
            throw new Error('Expected request to fail');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                expect(error.response?.status).toBe(500);
            } else {
                throw error;
            }
        }
    }).timeout(TEST_TIMEOUT);

    it('should work with beFriendly set to false', async () => {
        const request: IQuickCheckRequest = {
            statement: 'The system shall provide user authentication',
            beFriendly: false
        };

        const response = await axios.post(endpoint, request);
        const result = response.data as IQuickCheckResponse;

        expect(response.status).toBe(200);
        expect(result).toHaveProperty('isRequirement');
    }).timeout(TEST_TIMEOUT);

    it('should handle missing beFriendly parameter', async () => {
        const request = {
            statement: 'The system shall provide user authentication'
        };

        const response = await axios.post(endpoint, request);
        const result = response.data as IQuickCheckResponse;

        expect(response.status).toBe(200);
        expect(result).toHaveProperty('isRequirement');
    }).timeout(TEST_TIMEOUT);
});