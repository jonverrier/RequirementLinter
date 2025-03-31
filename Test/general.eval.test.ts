import { expect } from 'expect';
import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';

import prompts from '../Src/Prompts.json';

const typedPrompts = prompts as IPrompt[];

const guidelines = fs.readFileSync(path.join(__dirname, '../Src/RequirementsGuidelines.md'), 'utf-8');

import { requirementsGuidelineCheckerPromptId, requirementsSplitterPromptId, requirementsFinalImproverPromptId } from '../Src/PromptIds';

import { PromptInMemoryRepository, IPromptRepository, IPrompt, throwIfUndefined, IChatDriverFactory, EModel, EModelProvider, ChatDriverFactory } from "promptrepository";


interface IRequirementExample {
    unacceptable: string;
    improved: string[];
}

const noActiveVoice: IRequirementExample = {
    unacceptable: "The Identity of the Customer shall be confirmed.",
    improved: ["The Identity of the Customer shall be confirmed by the {System}.", "The {System} shall confirm the Customer_Identity."]
};

const noDefinitionReference: IRequirementExample = {
    unacceptable: "The <SOI> shall display the current time as defined in <Display Standard xyz>.",
    improved: ["The <SOI> shall display the Current_Time as defined in <Display Standard xyz>."]
};

const noDefinition: IRequirementExample = {
    unacceptable: "The <SOI> shall provide a time display.",
    improved: ["The <SOI> shall display the Current_Time as defined in <display standard xyz>."]
};

const noDefinition2: IRequirementExample = {
   unacceptable: "The <corporate website> shall only use Approved_Fonts.",
   improved: ["The <corporate website> shall display information using Approved_Fonts defined in <Display Standard xyz>."]
};

const incorrectSpelling: IRequirementExample = {
   unacceptable: "The Weapon_System shall store the location of each ordinance.",
   improved: ["The Weapon_System shall store the Location of each Ordnance."]
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

const notMeasurable: IRequirementExample = {
    unacceptable: "The <SOI> shall not fail.",
    improved: ["The <SOI> shall have an Availability of greater than or equal to 95%.", "The <SOI> shall have a Mean Time Between Failures (MTBF) of xx operating hours."]
};

const notMeasurable2: IRequirementExample = {
    unacceptable: "The <SOI> shall not contain mercury.",
    improved: ["The <SOI> shall limit metallic mercury exposure to those coming in contact with the <SOI> to less than or equal 0.025 mg/m3 over a period of 8 hours"]
};


function extractCodeFencedContent(response: string): string {
   const codeBlocks = response.match(/```(?:code|plaintext|requirement)?\s*([\s\S]*?)```/g);
   const codeBlockMatch = codeBlocks ? codeBlocks.map(block => {
       const content = block.match(/```(?:code|plaintext|requirement)?\s*([\s\S]*?)```/);
       return content ? content[1] : '';
   }).join('\n').trim() : null;
   
   let result = codeBlockMatch ? codeBlockMatch.trim() : '';
   return result;
}

function logAIResponseVsSuggested(initial: string, aiResponse: string, suggested: string[]) {
   console.log(`\nInitial: ${initial}`);
   console.log(`AI Response: ${aiResponse}`);
   console.log(`Suggested: ${suggested.join(", ")}`);
}

async function getImprovedRequirement(promptRepo: IPromptRepository, id: string, params: { [key: string]: string }) : Promise<string> {

   const prompt = promptRepo.getPrompt(id);
   throwIfUndefined(prompt?.systemPrompt);

   const chatDriverFactory = new ChatDriverFactory();
   const chatDriver = chatDriverFactory.create (EModel.kLarge, EModelProvider.kOpenAI);

   const systemPrompt = prompt.systemPrompt;

   const userPrompt = promptRepo.expandUserPrompt(prompt!, params);

   let evalResponse = await chatDriver.getModelResponse(systemPrompt, userPrompt);
   const improvedRequirement = extractCodeFencedContent(evalResponse);
   throwIfUndefined(improvedRequirement);

   return improvedRequirement;
}

async function evaluateRequirement(promptRepo: IPromptRepository, requirement: string, suggested: string[]) : Promise<string> {

   let wordCount = requirement.length * 5;

   const improvedRequirement = await getImprovedRequirement(promptRepo, requirementsGuidelineCheckerPromptId,{
      guidelines: guidelines,
      requirement: requirement,
      wordCount: wordCount.toString()
   });

   let splitRequirement = await getImprovedRequirement (promptRepo, requirementsSplitterPromptId, {
      requirement: improvedRequirement
   });

   //let finalRequirement = await getImprovedRequirement (promptRepo, requirementsFinalImproverPromptId, {
   //   requirement: splitRequirement
   //});

   logAIResponseVsSuggested(requirement, splitRequirement, suggested);

   return splitRequirement || '';
}

describe('Requirements Evaluation Tests', () => {

   const TEST_TIMEOUT = 30000; // 30 seconds as we have a large prompt with all the requirements

   const promptRepo: IPromptRepository = new PromptInMemoryRepository(typedPrompts);
   
   it('should improve General Rules / no active voice', async () => {

      const response = await evaluateRequirement(promptRepo, noActiveVoice.unacceptable, noActiveVoice.improved);
      // Checks if response contains "shall" or "must" followed by confirmation/verification terms,
      // indicating proper active voice construction
      expect(response).toMatch(/(shall|must) (be confirmed by|confirm|be verified by|verify)/);

   }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / no definition reference', async () => {

      const response = await evaluateRequirement(promptRepo, noDefinitionReference.unacceptable, noDefinitionReference.improved);
      // Checks if response contains "as defined in" or "as defined by" or "in accordance with"
      // indicating proper definition construction
      expect(response).toMatch(/(as defined in|as defined by|in accordance with|adhering to|according to|specified by|specified in|listed in|shall adhere to)/);

   }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / spelling', async () => {

      const response = await evaluateRequirement(promptRepo, incorrectSpelling.unacceptable, incorrectSpelling.improved);

      expect(response).toMatch(/(ordnance)/);

   }).timeout(TEST_TIMEOUT);   

   it('should improve General Rules / no definition', async () => {

      const response = await evaluateRequirement(promptRepo, noDefinition.unacceptable, noDefinition.improved);
      // Checks if response contains "as defined in" or "as defined by" or "in accordance with" etc
      // indicating proper definition construction
      expect(response).toMatch(/(defined in|defined by|in accordance with|adhering to|according to|specified by|specified in|listed in|time display shall|shall adhere to|format|current time in)/);

   }).timeout(TEST_TIMEOUT);   

   it('should improve General Rules / no definition 2', async () => {

      const response = await evaluateRequirement(promptRepo, noDefinition2.unacceptable, noDefinition2.improved);
      // Checks if response contains "as defined in" or "as defined by" or "in accordance with"
      // indicating proper definition construction
      expect(response).toMatch(/(defined in|defined by|in accordance with|adhering to|according to|specified by|specified in|listed in|selected from)/);

   }).timeout(TEST_TIMEOUT);     

   it('should improve General Rules / no units', async () => {

      const response = await evaluateRequirement(promptRepo, noUnits.unacceptable, noUnits.improved);
      // Checks if response contains "Celsius" or "Farenheit" or "Kelvin"
      // indicating proper unit construction
      expect(response).toMatch(/(Celsius|Farenheit|Kelvin)/);

   }).timeout(TEST_TIMEOUT);  

   it('should improve General Rules / no active voice and no definitions', async () => {

      const response = await evaluateRequirement(promptRepo, noActiveVoiceAndNoDefinitionsEither.unacceptable, noActiveVoiceAndNoDefinitionsEither.improved);
      // Checks if response contains either:
      // 1. The word "shall" or "must" appearing twice in any order with any text between them
      // 2. The exact phrases "shall categorize" or "shall assess"
      expect(response).toMatch(/(?:shall|must)[\s\S]*?(?:shall|must)|(shall categorize|shall assess|shall classify|shall verify|shall adhere to)/s);    

   }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / two Requirements', async () => {

      const response = await evaluateRequirement(promptRepo, twoRequirements.unacceptable, twoRequirements.improved);

      // Checks if response contains "shall" or "must" at least twice
      // indicating requirement has been split into two separate requirements
      expect(response).toMatch(/(?:shall|must)[\s\S]*?(?:shall|must)/s);

      }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / unclear definitions', async () => {

      const response = await evaluateRequirement(promptRepo, unclearDefinitions.unacceptable, unclearDefinitions.improved);

      // Checks if response contains either:
      // 1. The word "shall" or "must" appearing twice in any order with any text between them
      // 2. The phrases "defined in" and variants 
      expect(response).toMatch(/(?:shall|must)[\s\S]*?(?:shall|must)|(defined in|defined by|defined as)/s);       

      }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / not measurable', async () => {

      const response = await evaluateRequirement(promptRepo, notMeasurable.unacceptable, notMeasurable.improved);

      expect(response).toMatch(/(%|less than|more than|greater than|at least|at most|not exceeding|not below|confirmed by|verified by|verified through|verified via|specified)/);

   }).timeout(TEST_TIMEOUT);

   it('should improve General Rules / not measurable 2', async () => {

      const response = await evaluateRequirement(promptRepo, notMeasurable2.unacceptable, notMeasurable2.improved);

      expect(response).toMatch(/(mg|ppm|PPM|%|less than|more than|greater than|at least|at most|not exceeding|not below|confirmed by|verified by|verified through|verified via|shall verify|specified)/);

   }).timeout(TEST_TIMEOUT);

});
