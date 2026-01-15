const MANIFEST_URL = 'https://wordpress.github.io/gutenberg/index.json';

interface ManifestEntry {
  id: string;
  title: string;
  name: string;
  importPath: string;
  storiesImports: string[];
  type: string;
  tags: string[];
}

interface Manifest {
  entries: ManifestEntry[];
}

interface Component {
  name: string;
  description: string;
}

export async function getComponents(): Promise<Component[]> {
  const response = await fetch(MANIFEST_URL);
  const data: Manifest = await response.json();

  return Object.entries(data.entries)
    .filter(
      ([slug]) =>
        slug.startsWith('design-system-components-') && slug.endsWith('--docs')
    )
    .map(([, entry]) => ({
      name: entry.title.replace('Design System/Components/', ''),
      description: entry.title,
    }));
}
