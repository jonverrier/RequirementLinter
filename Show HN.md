Show HN:Requirement Linter, an LLM-powered tool to improve software requirements

I built Requirement Linter, an LLM-powered tool that helps improve software requirements by checking them against established industry guidelines.

Why build this:
As Annie Vella pointed out in her research on collaborative AI-person software lifecycles (https://annievella.com/posts/the-sdlc-strikes-back/), AI isn't just accelerating development - it's reshaping the way we build software altogether. The reality is that we’re not writing all the code by hand anymore. Instead, we’re writing specifications and prompts for AI coding assistants to generate code for us. Requirements need to be clearer. This tool addresses exactly that problem. 

How it works:
The linter uses an LLM to analyse requirements against guidelines from the International Council of Systems Engineering's Guide to Writing Requirements (GtWR), then suggests improvements to make them clearer, more measurable, and properly structured.

Example:

Input: 
```plaintext   
The system should respond quickly.
```

Output:
The requirement "the system should respond quickly" needs improvement based on several guidelines.
1. **Vague Terms (R7):** The term "quickly" is vague and lacks specific measurable performance targets. It should be defined with a specific response time.
2. **Active Voice (R2):** The requirement does not clearly identify the responsible entity. It should specify who or what is responsible for the action.
3. **Measurable Performance (R34):** The requirement lacks specific, measurable performance criteria that can be verified.
4. **Unambiguous (Characteristics):** The requirement is ambiguous and can be interpreted in multiple ways.
Here's a revised version:
```plaintext
The system shall respond to user inputs within 2 seconds under normal operating conditions.
```
This revision addresses the issues by providing a specific response time, using active voice, and ensuring the requirement is measurable and unambiguous.

Try it online: https://nice-wave-0746ea503.6.azurestaticapps.net/index
GitHub repo: https://github.com/jonverrier/RequirementLinter
Feedback welcome!