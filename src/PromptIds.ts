// ===Start StrongAI Generated Comment (20260314)===
// This module defines and exports stable identifiers for prompt templates used across the application. Each export is a UUID string that uniquely names a specific prompt so other parts of the system can reference, fetch, or invoke the correct template without hardcoding text. There are no imports or runtime dependencies; the file is purely declarative and has no side effects.
// 
// chunkContextSummariserPromptId identifies a prompt that summarizes contextual chunks, likely for condensing retrieved text into a concise form.
// 
// requirementsGuidelineCheckerPromptId points to a prompt that validates requirements against predefined guidelines.
// 
// requirementsSplitterPromptId identifies a prompt that decomposes compound requirements into smaller, actionable units.
// 
// requirementsFeasibilityCheckerPromptId names a prompt that assesses whether requirements are feasible.
// 
// userStoryFeasibilityCheckerPromptId identifies a prompt that evaluates the practicality of a user story.
// 
// userStoryGuidelineCheckerPromptId points to a prompt that checks a user story against writing or quality guidelines.
// 
// Consumers typically pass these IDs to a prompt registry, configuration layer, or model runner to load the correct template and ensure consistency, versioning, and auditability across workflows involving requirements and user stories.
// ===End StrongAI Generated Comment===


export const chunkContextSummariserPromptId = "8340054d-f96a-426a-8ae2-0632a01faca1";

export const requirementsGuidelineCheckerPromptId = "bf864025-a48d-4d25-a1da-48f55da3fe26";
export const requirementsSplitterPromptId = "78dc3a65-d327-4643-8e7e-ce76a1b786ce";
export const requirementsFeasibilityCheckerPromptId = "f5cf984e-bd36-40a4-9044-dc905e6df7fe";

export const userStoryFeasibilityCheckerPromptId = "d7a91f23-8e4c-4d19-b67f-12c9b3a5e8f4";
export const userStoryGuidelineCheckerPromptId = "c2f83d4b-1e47-4a8f-9648-45b16d1f85a9";
