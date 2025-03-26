
import { expect } from 'expect';
import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';

import prompts from '../Src/Prompts.json';


const guidelines = fs.readFileSync(path.join(__dirname, '../Src/RequirementsGuidelines.md'), 'utf-8');

import { requirementsGuidelineCheckerPromptId } from '../Src/PromptIds';

import { PromptInMemoryRepository, IPrompt, IPromptRepository, getModelResponse, throwIfUndefined  } from "promptrepository";


interface IRequirementExample {
    unacceptable: string;
    improved: string[];
}

const noSubject: IRequirementExample = {
    unacceptable: "The Identity of the Customer shall be confirmed.",
    improved: ["The Identity of the Customer shall be confirmed by the {System}.", "The {System} shall confirm the Customer_Identity."]
};

const noDefinition: IRequirementExample = {
    unacceptable: "The <SOI> shall display the current time as defined in <Display Standard xyz>.",
    improved: ["The <SOI> shall display the Current_Time as defined in <Display Standard xyz>."]
};

const noDefinitionReference: IRequirementExample = {
    unacceptable: "The <SOI> shall provide a time display.",
    improved: ["The <SOI> shall display the Current_Time as defined in <display standard xyz>."]
};

const noUnits: IRequirementExample = {
    unacceptable: "With power applied, The Circuit_Board shall <…> a temperature of less than 30 degrees.",
    improved: ["With power applied, The Circuit_Board shall <…> a temperature of less than 30 degrees Celsius."] 
};


describe('Requirements Evaluation Tests', () => {

   const TEST_TIMEOUT = 20000; // 10 seconds

   let prompt: IPrompt = prompts.find(p => p.id === requirementsGuidelineCheckerPromptId)!;

   const promptRepo: IPromptRepository = new PromptInMemoryRepository([prompt]);

   async function evaluateRequirement(requirement: string) {
      const prompt = promptRepo.getPrompt(requirementsGuidelineCheckerPromptId);
      expect(prompt).toBeDefined();

      throwIfUndefined(prompt?.systemPrompt);

      const systemPrompt = prompt.systemPrompt;
      let wordCount = requirement.length * 5;

      const userPrompt = promptRepo.expandUserPrompt(prompt!, {
         guidelines: guidelines,
         requirement: requirement,
         wordCount: wordCount.toString()
      });

      return await getModelResponse(systemPrompt, userPrompt);
   }

   it('should generate meaningful feedback for General Rules / no subject', async () => {

      const response = await evaluateRequirement(noSubject.unacceptable);
      expect(response).toMatch(/(shall|must) (be confirmed by|confirm|be verified by|verify)/);

   }).timeout(TEST_TIMEOUT);

   it('should generate meaningful feedback for General Rules / no definition', async () => {

      const response = await evaluateRequirement(noDefinition.unacceptable);
      expect(response).toMatch(/(as defined in|as defined by|in accordance with)/);

   }).timeout(TEST_TIMEOUT);

   it('should generate meaningful feedback for General Rules / no reference', async () => {

      const response = await evaluateRequirement(noDefinitionReference.unacceptable);
      expect(response).toMatch(/(as defined in|as defined by|in accordance with|format)/);

   }).timeout(TEST_TIMEOUT);   

   it('should generate meaningful feedback for General Rules / no units', async () => {

      const response = await evaluateRequirement(noUnits.unacceptable);
      expect(response).toMatch(/(Celsius|Farenheit|Kelvin)/);

   }).timeout(TEST_TIMEOUT);  
});
