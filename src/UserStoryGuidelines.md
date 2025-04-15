# Writing Good User Stories

This document provides a set of guidelines for writing good user stories, sourced from:
https://www.gov.uk/service-manual/agile-delivery/writing-user-stories 
https://miro.com/agile/how-to-write-good-user-story/ 
https://medium.com/theproductperson/writing-better-user-stories-through-active-acceptance-criteria-5615a54e2750

R1 A User Story should always include the person using the service (the actor)
R2 A User Story should always include what the user needs the service for (the narrative)
R3 A User Story should always include why the user needs it (the goal)
R4 User Stories are usually written in the format 'As a… [who is the user?] I need/want/expect to… [what does the user want to do?] so that… [why does the user want to do this?] Acceptance Criteria [how will it be verified that the service meets the user need]'
R5 User Stories include at least one Acceptance Criteria. Acceptance Criteria are a list of outcomes that are used as a checklist to confirm that the service has done its job and is meeting that user need.

R6 The INVEST framework outlines the characteristics of a well-crafted story.
R6.1 Independent: Astory should stand alone, meaning it doesn’t rely on other stories to make sense. Independence allows teams to prioritize and tackle tasks without unnecessary dependencies. For example, creating a user login feature can be developed separately from implementing a password reset function.
R6.2: Negotiable: User stories are not rigid. They serve as a starting point for discussions and can be refined as the team collaborates. For instance, stakeholders may suggest tweaks to meet new requirements or clarify expectations during sprint planning.
R6.3 Valuable: Every story must deliver value to the user or business. This ensures that the team focuses on meaningful outcomes. For example, creating a notification system adds value by keeping users informed in real time.
R6.4 Estimable: Stories need to be clear enough for the team to estimate the time and effort required. Without proper estimation, planning and scheduling become challenging. Including specific details like "notify users within 10 seconds of an action" helps make the scope tangible.
R6.5 Small: A user story should be small enough to complete within a sprint. Breaking down larger tasks into smaller stories ensures they are manageable. For example, instead of "build a customer dashboard," you might create separate stories for "add customer login," "create account summary page," and "add filtering options."
R6.6 Testable : A story must include clear acceptance criteria that define success. This allows teams to verify that the feature meets expectations. For instance, "The login page should display an error message when incorrect credentials are entered" provides a testable outcome.


# Acceptance Criteria
R7.1 Active Acceptance Criteria : Use the active voice in the needs statement with the responsible entity clearly identified as the subject of the sentence. 
R7.2 Appropriate Acceptance Criteria Subject-Verb: Ensure the subject and verb of the need statement are appropriate to the entity to which the statement refers.
R7.3 Single Thought Sentence: Write a single sentence that contains a single thought conditioned and qualified by relevant sub-clauses. |

# General Criteria
R8.1 Defined Terms : Define all domain-specific terms used within the need statement within an associated glossary and/or data dictionary.
R8.2 Common Units of Measure: When stating quantities, all numbers should have appropriate and consistent units of measure explicitly stated using a common measurement system in terms of the thing the number refers.
R8.3 Combinators : Avoid words that join or combine clauses, such as “and”, “or”, “then”, “unless”, “but”, “as well as”, “but also”, “however”, “whether”, “meanwhile”, “whereas”, “on the other hand”, or “otherwise”. 
R8.4 Correct Grammar: Use correct grammar, spelling, and punctuation. 
R8.5 Correct Spelling : Ensure correct spelling is used.
R8.6 Correct Punctuation : Use correct punctuation.
R8.7 Use of “Not” : Avoid the use of “not.”
R8.8 Headings : Avoid relying on headings to support explanation or understanding of the need. |
R8.9 Range of Values : Define each quantity with a range of values appropriate to the entity to which the quantity applies and against which the entity will be verified or validated.
R8.10 Measurable Performance : Provide specific measurable performance targets appropriate to the entity to which the need is stated and against which the entity will be verified to meet.
R8.11 Vague Terms: Avoid the use of vague terms that provide vague quantification, such as “some”, “any”, “allowable”, “several”, “many”, “a lot of”, “a few”, “almost always”, “very nearly”, “nearly”, “about”, “close to”, “almost”, and “approximate”. Avoid vague adjectives such as “ancillary”, "relevant”, “routine”, “common”, “generic”, “significant”, “flexible”, “expandable”, “typical”, “sufficient”, “adequate”, “appropriate”, “efficient”, “effective”, “proficient”, “reasonable” and “customary.”
R8.12 escape Clauses: Avoid the inclusion of escape clauses that state vague conditions or possibilities, such as “so far as is possible”, “as little as possible”, “where possible”, “as much as possible”, “if it should prove necessary”, “if necessary”, “to the extent necessary”, “as appropriate”, “as required”, “to the extent practical”, and “if practicable”.
R8.13 Open-Ended Clauses : Avoid open-ended, non-specific clauses such as “including but not limited to”, “etc.” and “and so on.”
R8.14 Superfluous Infinitives : Avoid the use of superfluous infinitives such as “to be designed to”, “to be able to”, “to be capable of”, “to enable”, “to allow”. 
R8.15 Use of Oblique Symbol:    | Avoid the use of the oblique ("/") symbol except in units, i.e., Km/hr, or fractions. 
R8.16 Purpose Phrases: Avoid phrases that indicate the “purpose of“, “intent of”, or “reason for” the need statement statement. 
R8.17 Absolutes: Avoid using unachievable absolutes such as 100% reliability, 100% availability, all, every, always, never, etc
R8.18 Universal Qualification : Use “each” instead of “all”, “any”, or “both” when universal quantification is intended.
R8.19 Temporal Dependencies : Define temporal dependencies explicitly instead of using indefinite temporal keywords such as “eventually”, “until”, “before”, “after”, “as”, “once”, “earliest”, “latest”, “instantaneous”, “simultaneous”, and “at last”. 
R8.20 Definite Articles : Use the definite article “the” rather than the indefinite articles “a” or “an”. |
R8.21 Logical Expressions : Use a defined convention to express logical expressions such as “[X AND Y]”, “[X OR Y]”, “[X XOR Y]”, “NOT [X OR Y]”. 
R8.22 Parentheses : Avoid parentheses and brackets containing subordinate text. 
R8.23 Enumeration : Enumerate sets explicitly instead of using a group noun to name the set. 
R8.24 Supporting Diagram or Model : When a need is related to complex behavior, refer to a supporting diagram or model. 
R8.25 Classification  : Classify needs and requirements according to the aspects of the problem or system it addresses. 
R8.26 Unique Expression : Express each need once and only once. 
R8.27 Solution Free : Avoid stating implementation in a need statement statement unless there is rationale for constraining the design. 
R8.28 Consistent Terms and Units : Use each term and unit of measure consistently throughout story sets as well as associated models and other SE artifacts developed across the lifecycle.
R8.28 Acronyms : If acronyms are used, they must be consistent throughout need sets as well as associated models and other SE artifacts developed across the lifecycle.
R8.29 Abbreviations : Avoid the use of abbreviations in needs statements as well as associated models and other engineering lifecycle artifacts.
R8.30 Decimal Format : Use a consistent format and number of significant digits for the specification of decimal numbers.

# Characteristics of good user story specification statements:
Necessary : The user story defines an essential capability, characteristic, constraint, and/or quality factor.
Appropriate : The specific intent and amount of detail of the user story is appropriate for the level entity to which it refers (level of abstraction).
Unambiguous : The user story is stated in such a way that it can be interpreted in only one way.
Complete : The user story sufficiently describes the necessary capability, characteristic, constraint, or quality factor to meet the entity need without needing other information to understand the user story. 
Singular : The user story should state a single capability, characteristic, constraint, or quality factor. 
Verifiable : The user story is structured and worded such that its realization can be proven (verified) to the customer’s satisfaction at the level the requirements exist. 
Conforming : The individual requirements should conform to an approved standard template and style for writing requirements, when applicable. 
Correct : The user story must be an accurate representation of the entity need from which it was transformed. 
Feasible : The user story can be realized within entity constraints (e.g., cost, schedule, technical, legal, regulatory) with acceptable risk. 






Copyright (c) 2025 Jon Verrier