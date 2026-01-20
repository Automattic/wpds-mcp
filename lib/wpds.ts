const COMPONENTS_MANIFEST_URL =
  'https://wordpress.github.io/gutenberg/manifests/components.json';

interface ManifestComponent {
  id: string;
  name: string;
  path: string;
  import?: string;
  description?: string;
  jsDocTags?: Array<{
    tag: string;
    name?: string;
    description?: string;
  }>;
  stories?: Array<{
    name: string;
    snippet?: string;
  }>;
}

interface ComponentsManifest {
  v: number;
  components: Record<string, ManifestComponent>;
}

export interface Component {
  name: string;
  description: string;
  packageName: string;
}

const ALLOWED_PACKAGES = ['@wordpress/components', '@wordpress/ui'];

/**
 * Extract the package name from an import statement.
 */
function extractPackageName(importStatement: string): string | null {
  const match = importStatement.match(/from\s+["']([^"']+)["']/);
  return match ? match[1] : null;
}

let cachedComponents: Component[] | null = null;

export async function getComponents(): Promise<Component[]> {
  if (cachedComponents) {
    return cachedComponents;
  }

  const response = await fetch(COMPONENTS_MANIFEST_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch components manifest: ${response.status} ${response.statusText}`
    );
  }

  const manifest: ComponentsManifest = await response.json();
  const allComponents = Object.values(manifest.components);

  cachedComponents = allComponents
    .map((component) => {
      const packageName = component.import
        ? extractPackageName(component.import)
        : null;

      return {
        name: component.name,
        description: component.description || '',
        packageName,
      };
    })
    .filter((component): component is Component =>
      component.packageName !== null &&
      ALLOWED_PACKAGES.includes(component.packageName)
    );

  return cachedComponents;
}
