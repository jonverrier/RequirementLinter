# Requirement Linter

Because no-one wants a fluffy requirement.

Influenced by Annie Vella's work on collaborative AI-person software lifecycles (which you can find [here](https://annievella.com/posts/the-sdlc-strikes-back/) and [here](https://dl.acm.org/doi/10.1145/3715003)). 

Why build this:
AI isn't just accelerating development - it's reshaping the way we build software altogether. The reality is that we’re not writing the code by hand anymore. Instead, we’re writing specifications and prompts for AI coding assistants to generate code for us. Requirements need to be clearer. This tool addresses exactly that problem. 

This is the first tool & we will build more - we need a whole lifecyle where we can interweave people and AI models.  

How it works:
We prompt an LLM (currently OpenAI GPT4o) to review your requirement against the guidelines from the International Council of Systems Engineering '[Guide to Writing Requirements](https://www.incose.org/docs/default-source/working-groups/requirements-wg/gtwr/incose_rwg_gtwr_v4_040423_final_drafts.pdf)' (GtWR). The GtWR is a mature product that is widely used in the industry.  

You can find an online version of the Requirement Linter [here](https://nice-wave-0746ea503.6.azurestaticapps.net/index). 

## Features

- Validates requirements against established guidelines
- Improves requirement clarity and measurability
- Splits compound requirements into atomic statements when necessary

## An Example

Input:
```plaintext
The system should respond quickly.
```

Output:
```plaintext
The requirement "the system should respond quickly" needs improvement based on several guidelines.
1. **Vague Terms (R7):** The term "quickly" is vague and lacks specific measurable performance targets. It should be defined with a specific response time.
2. **Active Voice (R2):** The requirement does not clearly identify the responsible entity. It should specify who or what is responsible for the action.
3. **Measurable Performance (R34):** The requirement lacks specific, measurable performance criteria that can be verified.
4. **Unambiguous (Characteristics):** The requirement is ambiguous and can be interpreted in multiple ways.

Here's a revised version:
The system shall respond to user inputs within 2 seconds under normal operating conditions.

This revision addresses the issues by providing a specific response time, using active voice, and ensuring the requirement is measurable and unambiguous.
```

## How it works

To generate a set of guidelines for well-formed requirements, we took the document from the [International Council of Systems Engineering 'Guide to Writing Requirements'](https://www.incose.org/docs/default-source/working-groups/requirements-wg/gtwr/incose_rwg_gtwr_v4_040423_final_drafts.pdf). The GtWR is a mature product that is widely used in the industry. 

We used Chat GPT to reformat the various tables in the document into plan Markdown tables. The resulting set of textual guidelines is in [src/RequirementsGuidelines.md](src/RequirementsGuidelines.md).

We then use the guidlines to build a prompt: 
````code
Here is a requirement:
```requirement
{requirement}
```
Review the requirement in the light of the following guidelines:
```guidelines 
{guidelines} 
```
Please give a succinct {wordCount} word review of the requirement by applying the guidelines. Focus on the most important issues first. For each issue found, cite the specific guideline rule number that was violated. Provide a re-phrased requirement (or multiple requirements if necessary) to comply with the guidelines, using code fences to demarcate the suggested new requirement(s). Consider the specific guidelines you have cited. Check your spelling and grammar.
````
There is another prompt to catch cases that need to be split - the main prompt was not great at this. This is run to post-process the result that comes from the main review. 

````code
Here is a requirement:
```requirement
{requirement}
```
If the requirement should be split into multiple distinct requirements for clarity, testability, or traceability, please rewrite them as separate requirements. Use code fences to demarcate the set of new requirements. Do not split if the requirement can reasonably be written as a single requirement. If the requirement does not need to be split, return it unchanged within code fences.
````

The functional tests are in [test/general.eval.test.ts](test/requirements.eval.test.ts). The test cases are taken from [here](https://www.incose.org/docs/default-source/working-groups/requirements-wg/shared_gtwr/gtwr_characteristics_section_4_050423.pdf?sfvrsn=9a7548c7_2). Not all of the test are included - this is because:
1) it turned into an exercise of writing regular expressions to catch increasigly compex conditions, and the value of the tests seemed to be dropping off vs just publishing the tool in a reasonable first draft state. 
2) as noted under installation, not all of the current tests always pass. The next focus area is getting the base set of evaluations to pass 100% of the time, which is a prompt engineering journey, and seems more valuable than coding dozens more regular expressions. 


## Development

To install:

Clone the companion [PromptRespository repo](https://github.com/jonverrier/PromptRespository). 

```plaintext
npm i

Ensure you have set your OpenAI API key as an environment variable: OPENAI_API_KEY, and that the PromptRespository package points to your local version.

npm run build
```
To run tests:
```plaintext
npm run test
```
Note that the tests do not currently always succeed. The case that fails most often is reference to a standard for the following test: "The <SOI> shall not contain mercury.". The guidlines state a better form should have conditional and qualification clauses, and key terms defined in the project glossary or data dictionary. So far no amount of prompt engineering has caught this - it's still a work in progress.  


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request against the development branch in the main repo. 

## License

MIT
Copyright (c) 2025 Jon Verrier