
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
    improved: ["The <SOI> shall display the Current_Time as defined in <Display Standard xyz>.", "The <SOI> shall display the Current_Time as defined in <Display Standard xyz>."]
};

const noDefinitionReference: IRequirementExample = {
    unacceptable: "The <SOI> shall provide a time display.",
    improved: ["The <SOI> shall display the Current_Time as defined in <display standard xyz>.", "The <SOI> shall display the Current_Time as defined in <display standard xyz>."]
};

const noUnits: IRequirementExample = {
    unacceptable: "With power applied, The Circuit_Board shall <…> a temperature of less than 30 degrees.",
    improved: ["With power applied, The Circuit_Board shall <…> a temperature of less than 30 degrees Celsius."] 
};


describe('Requirements Evaluation Tests', () => {

   const TEST_TIMEOUT = 10000; // 10 seconds
   
   let prompt: IPrompt = prompts.find(p => p.id === requirementsGuidelineCheckerPromptId)!;

   const promptRepo : IPromptRepository= new PromptInMemoryRepository([prompt]);

    it('should generate meaningful feedback to meet General Rules for Requirement Statements / no subject', async () => {
        const prompt = promptRepo.getPrompt(requirementsGuidelineCheckerPromptId);
        expect(prompt).toBeDefined();
        
        throwIfUndefined(prompt?.systemPrompt);

        const systemPrompt = prompt.systemPrompt;
        let requirement = noSubject.unacceptable;
        let wordCount = requirement.length * 5;

        const userPrompt = promptRepo.expandUserPrompt(prompt!, { 
            guidelines: guidelines, 
            requirement: requirement, 
            wordCount: wordCount.toString() 
        });

        const response = await getModelResponse(systemPrompt, userPrompt);
        expect(response).toMatch(/(shall|must) (be confirmed by|confirm|be verified by|verify)/);
        
    }).timeout(TEST_TIMEOUT);
});
