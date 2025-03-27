
import { expect } from 'expect';
import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';

import prompts from '../Src/Prompts.json';

const guidelines = fs.readFileSync(path.join(__dirname, '../Src/RequirementsGuidelines.md'), 'utf-8');

import { requirementsGuidelineCheckerPromptId, requirementsSplitterPromptId } from '../Src/PromptIds';

import { PromptInMemoryRepository, IPrompt, IPromptRepository, getModelResponse, throwIfUndefined  } from "promptrepository";


interface IRequirementExample {
    unacceptable: string;
    improved: string[];
}

const noActiveVoice: IRequirementExample = {
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

const noActiveVoiceAndNoDefinitionsEither: IRequirementExample = {
    unacceptable: "The user shall either be trusted or not trusted.", 
    improved: ["The Security_System shall categorize each User as EITHER Trusted OR Not_Trusted."]
};

const twoRequirements: IRequirementExample = {
    unacceptable: "The <SOI> shall display the Location and Identity of the Lead_Vehicle.",
    improved: ["The <SOI> shall display the Location of the Lead_Vehicle per <Display Standard xyx>.", "The <SOI> shall display the Identity of the Lead_Vehicle per <Display Standard xyx>."]
};

const unclearDefinitions: IRequirementExample = {
    unacceptable: "The <SOI> shall provide an audible or visual alarm having the characteristics defined in <alarm standard xyz>.",
    improved: ["The <SOI> shall provide EITHER an Audible_Alarm OR Visual_Alarm having the characteristics defined in <Alarm Standard xyz>.",
      "The <SOI> shall provide an Audible_Alarm having the characteristics defined in <Alarm Standard xyz>.", "The <SOI> shall provide a Visual_Alarm having the characteristics defined in <Alarm Standard xyz>."
    ]
};

/*
Unacceptable: The <corporate website> shall only use Approved_Fonts.
 Improved: The <corporate website> shall display information using Approved_Fonts defined in <Display 
Standard xyz>.
 Unacceptable: The Weapon_System shall store the location of each ordinance.
 Improved: The Weapon_System shall store the Location of each Ordnance. 
Unacceptable: The <SOI> shall not fail. 
Improved: 
The <SOI> shall have an Availability of greater than or equal to 95%.  or 
The <SOI> shall have a Mean Time Between Failures (MTBF) of xx operating hours.
 Unacceptable: The <SOI> shall not contain mercury. 
Improved: The <SOI> shall limit metallic mercury exposure to those coming in contact with the <SOI> to less 
than or equal 0.025 mg/m3 over a period of 8 hours
*/

function extractCodeFencedContent(response: string): string {
   // Verify response contains code fences
   expect(response).toMatch(/```[\s\S]*```/);
   // Extract text between code fences using regex
   const codeBlockMatch = response.match(/```(?:code|plaintext)?\s*([\s\S]*?)```/);
   return codeBlockMatch ? codeBlockMatch[1].trim() : '';
}

describe('Requirements Evaluation Tests', () => {

   const TEST_TIMEOUT = 20000; // 20 seconds as we have a large prompt with all the

   const promptRepo: IPromptRepository = new PromptInMemoryRepository(prompts);

   function logAIResponseVsSuggested(initial: string, aiResponse: string, suggested: string[]) {
      console.log(`Initial: ${initial}`);
      console.log(`AI Response: ${aiResponse}`);
      console.log(`Suggested: ${suggested.join(", ")}`);
   }

   async function evaluateRequirement(requirement: string, suggested: string[]) {
      const evalPrompt = promptRepo.getPrompt(requirementsGuidelineCheckerPromptId);
      expect(evalPrompt).toBeDefined();

      throwIfUndefined(evalPrompt?.systemPrompt);

      const evalSystemPrompt = evalPrompt.systemPrompt;
      let wordCount = requirement.length * 5;

      const evalUserPrompt = promptRepo.expandUserPrompt(evalPrompt!, {
         guidelines: guidelines,
         requirement: requirement,
         wordCount: wordCount.toString()
      });

      let evalResponse = await getModelResponse(evalSystemPrompt, evalUserPrompt);
      const improvedRequirement = extractCodeFencedContent(evalResponse);
      expect(improvedRequirement).toBeTruthy();

      const splitPrompt = promptRepo.getPrompt(requirementsSplitterPromptId);
      expect(splitPrompt).toBeDefined();

      throwIfUndefined(evalPrompt?.systemPrompt);

      const splitSystemPrompt = evalPrompt.systemPrompt;

      const splitUserPrompt = promptRepo.expandUserPrompt(splitPrompt!, {
         requirement: requirement
      });

      let splitResponse = await getModelResponse(splitSystemPrompt, splitUserPrompt);
      const splitImprovedRequirement = extractCodeFencedContent(splitResponse);
      expect(splitImprovedRequirement).toBeTruthy();

      logAIResponseVsSuggested(requirement, improvedRequirement, suggested);

      return improvedRequirement;
   }

   it('should improve General Rules / no active voice', async () => {

      const response = await evaluateRequirement(noActiveVoice.unacceptable, noActiveVoice.improved);
      // Checks if response contains "shall" or "must" followed by confirmation/verification terms,
      // indicating proper active voice construction
      expect(response).toMatch(/(shall|must) (be confirmed by|confirm|be verified by|verify)/);

   }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / no definition', async () => {

      const response = await evaluateRequirement(noDefinition.unacceptable, noDefinition.improved);
      // Checks if response contains "as defined in" or "as defined by" or "in accordance with"
      // indicating proper definition construction
      expect(response).toMatch(/(as defined in|as defined by|in accordance with|adhering to|according to|specified by|specified in)/);

   }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / no reference', async () => {

      const response = await evaluateRequirement(noDefinitionReference.unacceptable, noDefinitionReference.improved);
      // Checks if response contains "as defined in" or "as defined by" or "in accordance with"
      // indicating proper definition construction
      expect(response).toMatch(/(as defined in|as defined by|in accordance with|format)/);

   }).timeout(TEST_TIMEOUT);   

   it('should improve General Rules / no units', async () => {

      const response = await evaluateRequirement(noUnits.unacceptable, noUnits.improved);
      // Checks if response contains "Celsius" or "Farenheit" or "Kelvin"
      // indicating proper unit construction
      expect(response).toMatch(/(Celsius|Farenheit|Kelvin)/);

   }).timeout(TEST_TIMEOUT);  

   it('should improve General Rules / no active voice and no definitions', async () => {

      const response = await evaluateRequirement(noActiveVoiceAndNoDefinitionsEither.unacceptable, noActiveVoiceAndNoDefinitionsEither.improved);
      // Checks if response contains either:
      // 1. The word "shall" or "must" appearing twice in any order with any text between them
      // 2. The exact phrases "shall categorize" or "shall assess"
      expect(response).toMatch(/(?:shall|must)[\s\S]*?(?:shall|must)|(shall categorize|shall assess)/s);    

   }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / two Requirements', async () => {

      const response = await evaluateRequirement(twoRequirements.unacceptable, twoRequirements.improved);

      // Checks if response contains "shall" or "must" at least twice
      // indicating requirement has been split into two separate requirements
      expect(response).toMatch(/(?:shall|must)[\s\S]*?(?:shall|must)/s);

      }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / unclear definitions', async () => {

      const response = await evaluateRequirement(unclearDefinitions.unacceptable, unclearDefinitions.improved);

      // Checks if response contains either:
      // 1. The word "shall" or "must" appearing twice in any order with any text between them
      // 2. The phrases "defined in" and variants 
      expect(response).toMatch(/(?:shall|must)[\s\S]*?(?:shall|must)|(defined in|defined by|defined as)/s);       

      }).timeout(TEST_TIMEOUT);
});
