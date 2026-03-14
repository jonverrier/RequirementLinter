// Copyright (c) 2025 Jon Verrier

// ===Start StrongAI Generated Comment (20260314)===
// This module provides a TypeScript ambient module declaration for Markdown file imports. Its purpose is to let you import files with a .md extension in TypeScript without compiler errors. It tells the TypeScript type system that any module path ending in .md is valid and can be imported.
// 
// There are no runtime exports from this file. It does not define functions, classes, or values. Instead, it augments the TypeScript compiler’s understanding of module shapes. Because the declaration has no body, any .md import is treated as having the any type. This is a permissive fallback that avoids type errors while deferring the actual content shape to the build tooling.
// 
// There are no imported dependencies. The declaration relies on TypeScript’s ambient module mechanism and your bundler or loader to supply real content at build time. Use this when your toolchain transforms Markdown (for example via Vite plugins, Webpack loaders, or similar). The declaration has no side effects and is compile-time only.
// ===End StrongAI Generated Comment===

declare module "*.md";