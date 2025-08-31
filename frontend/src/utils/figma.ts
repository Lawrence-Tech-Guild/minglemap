export type DesignTokens = Record<string, any>;

function toVarName(path: string[]): string {
  return `--${path.join('-')}`;
}

export function tokensToCss(tokens: DesignTokens): string {
  const lines: string[] = [':root {'];
  const walk = (obj: any, path: string[]) => {
    for (const [key, value] of Object.entries(obj)) {
      const current = [...path, key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        walk(value, current);
      } else if (Array.isArray(value)) {
        if (value.length === 2) {
          lines.push(`  ${toVarName(current)}: ${value[0]};`);
          lines.push(`  ${toVarName([...current, 'line-height'])}: ${value[1]};`);
        } else {
          lines.push(`  ${toVarName(current)}: ${value.join(', ')};`);
        }
      } else {
        lines.push(`  ${toVarName(current)}: ${value};`);
      }
    }
  };
  walk(tokens, []);
  lines.push('}');
  return lines.join('\n');
}

export function tokensToTailwind(tokens: DesignTokens): Record<string, any> {
  const theme: Record<string, any> = {};
  const mapVars = (obj: any, prefix: string[]): Record<string, any> => {
    return Object.fromEntries(
      Object.keys(obj).map((key) => [key, `var(--${[...prefix, key].join('-')})`])
    );
  };

  if (tokens.colors) {
    theme.colors = mapVars(tokens.colors, ['colors']);
  }
  if (tokens.spacing) {
    theme.spacing = mapVars(tokens.spacing, ['spacing']);
  }
  if (tokens.radius) {
    theme.borderRadius = mapVars(tokens.radius, ['radius']);
  }
  if (tokens.typography?.fontFamily) {
    theme.fontFamily = mapVars(tokens.typography.fontFamily, ['typography', 'fontFamily']);
  }
  if (tokens.typography?.fontSize) {
    const sizes: Record<string, any> = {};
    for (const [key] of Object.entries(tokens.typography.fontSize)) {
      sizes[key] = [
        `var(--typography-fontSize-${key})`,
        { lineHeight: `var(--typography-fontSize-${key}-line-height)` },
      ];
    }
    theme.fontSize = sizes;
  }
  return theme;
}
