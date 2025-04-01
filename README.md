# Requirements Linter

Because no-one wants a fluffy requirement.

**Requirements Linter** is an LLM-powered tool for automatically reviewing and improving software requirements according to established guidelines. The Requirements Linter helps ensure requirements are clear, measurable, and properly structured.

## Features

- Validates requirements against established guidelines
- Improves requirement clarity and measurability
- Splits compound requirements into atomic statements when necessary

## Examples

Input:
```plaintext
The Identity of the Customer shall be confirmed.
```

Output:
```plaintext
The System shall confirm the Customer_Identity.
```

Input:
```plaintext
The vehicle's engine oil shall operate at a minimum temperature of 80°C and the Speedometer shall display speed in kph.
```

Output:
```plaintext
The vehicle's engine oil shall operate at a minimum temperature of 80°C.

The Speedometer shall display speed in kph.
```

## How it works

To generate a set of guidelines for well-formed requirements, I took the document from the [International Council of Systems Engineering 'Guide to Writing Requirements'](https://www.incose.org/docs/default-source/working-groups/requirements-wg/gtwr/incose_rwg_gtwr_v4_040423_final_drafts.pdf). The GtWR is a mature product that is widely used in the industry. 

I used Chat GPT to reformat the various tables in the document into plan Markdown tables. The resulting set of textual guidelines is in [src/RequirementsGuidelines.md](src/RequirementsGuidelines.md).

I then use the guidlines to build a prompt: 
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
There is another prompt to catch cases that need to be split - I found the main prompt was not great at this. This is run to post-process the result that comes from the main review. 

````code
Here is a requirement:
```requirement
{requirement}
```
If the requirement should be split into multiple distinct requirements for clarity, testability, or traceability, please rewrite them as separate requirements. Use code fences to demarcate the set of new requirements. Do not split if the requirement can reasonably be written as a single requirement. If the requirement does not need to be split, return it unchanged within code fences.
````

The functional tests are in [test/general.eval.test.ts](test/general.eval.test.ts). The test cases are taken from [here](https://www.incose.org/docs/default-source/working-groups/requirements-wg/shared_gtwr/gtwr_characteristics_section_4_050423.pdf?sfvrsn=9a7548c7_2). Not all of the test are included - this is because:
1) it turned into an exercise of writing regular expressions to catch increasigly compex conditions, and the value of the tests seemed to be dropping off vs just publishing the tool in a reasonable first draft state. 
2) as noted under installation, not all of the current tests always pass. My next focus is going to be getting the base set of evaluations to pass 100% of the time, which is a prompt engineering journey, and seems more valuable than coding dozens more regular expressions. 


## Development

To install:

Clone the companion [PromptRespository repo](https://github.com/jonverrier/PromptRespository). 

```bash
npm i

Ensure you have set your OpenAI API key as an environment variable: OPENAI_API_KEY, and that the PromptRespository package points to your local version.

npm run build
```
To run tests:
```bash
npm run test
```
Note that the tests do not always succeed. The case that fails most often is reference to a standard for the following test: "The <SOI> shall not contain mercury.". The guidlines state a better form should have conditional and qualification clauses, and key terms defined in the project glossary or data dictionary. So far no amount of prompt engineering has caught this - it's still a work in progress.  

To run the web app front end:
```bash

```

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