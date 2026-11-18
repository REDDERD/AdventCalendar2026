// content:compile – Ink → JSON plus the choice catalog [ARC-1] [INK-1].
import { compileAll, writeOutputs } from './ink-compiler';

const result = compileAll();
for (const w of result.warnings) console.warn(`warn  ${w}`);
for (const e of result.errors) console.error(`error ${e}`);
if (result.errors.length) process.exit(1);
writeOutputs(result);
console.log(
  `Compiled ${Object.keys(result.stories).length} stories, ${result.catalog.length} choice points.`,
);
