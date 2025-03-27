# Requirements Linter

A tool for automatically improving and validating software requirements according to established guidelines. The Requirements Linter helps ensure requirements are clear, measurable, and properly structured.

## Features

- Validates requirements against established guidelines
- Improves requirement clarity and measurability
- Splits compound requirements into atomic statements
- Enforces proper active voice construction
- Ensures proper definition references and units
- Validates spelling and terminology

## Examples

Input:
```plaintext
The Identity of the Customer shall be confirmed.
```

Output:
```plaintext
The System shall confirm the Customer_Identity.
```

## Development

To run tests:
```bash
npm test
```

