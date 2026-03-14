// ===Start StrongAI Generated Comment (20260314)===
// This declaration file enables TypeScript to understand imports of Markdown files. It defines an ambient module pattern for any path ending in .md, so the compiler will not raise “cannot find module” errors when you import Markdown content. The purpose is purely type-level: it has no runtime behavior and produces no JavaScript.
// 
// The main export is implicit. Any import from a .md path resolves to a value of the any type unless your project augments it elsewhere. This lets you write import doc from "./readme.md" without type complaints. Because the type is any, consumers should narrow or assert types if they rely on specific loader outputs.
// 
// There are no runtime or type imports in this file. Instead, it relies on your build tooling to provide actual Markdown handling. Common integrations include Vite, Webpack, Rollup, or esbuild plugins that load .md files as strings, HTML, React/Vue components, or objects with frontmatter. This declaration simply tells TypeScript to allow those imports.
// ===End StrongAI Generated Comment===


declare module "*.md";