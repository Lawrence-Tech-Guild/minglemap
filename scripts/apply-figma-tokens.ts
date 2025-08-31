import fs from 'fs';
import path from 'path';
import tokens from '../frontend/design-tokens.json';
import { tokensToCss, tokensToTailwind } from '../frontend/src/utils/figma';

const css = tokensToCss(tokens);
const cssPath = path.resolve(__dirname, '../frontend/src/styles/tokens.css');
fs.mkdirSync(path.dirname(cssPath), { recursive: true });
fs.writeFileSync(cssPath, css + '\n');

const theme = tokensToTailwind(tokens);
const config = `import type { Config } from 'tailwindcss';\n\nexport default {\n  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],\n  theme: {\n    extend: ${JSON.stringify(theme, null, 2)}\n  },\n  plugins: [],\n} satisfies Config;\n`;

const configPath = path.resolve(__dirname, '../frontend/tailwind.config.ts');
fs.writeFileSync(configPath, config);
