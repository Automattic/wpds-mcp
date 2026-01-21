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
  reactDocgen?: {
    description?: string;
    displayName?: string;
    props?: Record<
      string,
      {
        required?: boolean;
        tsType?: { name: string; raw?: string };
        description?: string;
        defaultValue?: { value: string };
      }
    >;
  };
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

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
  deprecated: boolean;
}

export interface ComponentDetail extends Component {
  importStatement?: string;
  props: ComponentProp[];
  stories: Array<{
    name: string;
    snippet?: string;
  }>;
}

const ALLOWED_PACKAGES = ['@wordpress/components', '@wordpress/ui'];

/**
 * Extract the package name from an import statement.
 */
function extractPackageName(importStatement: string): string | null {
  const match = importStatement.match(/from\s+["']([^"']+)["']/);
  return match ? match[1] : null;
}

let cachedManifest: ComponentsManifest | null = null;

async function getManifest(): Promise<ComponentsManifest> {
  if (cachedManifest) {
    return cachedManifest;
  }

  const response = await fetch(COMPONENTS_MANIFEST_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch components manifest: ${response.status} ${response.statusText}`,
    );
  }

  const manifest: ComponentsManifest = await response.json();
  cachedManifest = manifest;
  return manifest;
}

export async function getComponents(): Promise<Component[]> {
  const manifest = await getManifest();
  const allComponents = Object.values(manifest.components);

  return allComponents
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
    .filter(
      (component): component is Component =>
        component.packageName !== null &&
        ALLOWED_PACKAGES.includes(component.packageName),
    );
}

export async function getComponentDetail(
  name: string
): Promise<ComponentDetail | null> {
  const manifest = await getManifest();
  const allComponents = Object.values(manifest.components);

  const component = allComponents.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (!component) {
    return null;
  }

  const packageName = component.import
    ? extractPackageName(component.import)
    : null;

  if (!packageName || !ALLOWED_PACKAGES.includes(packageName)) {
    return null;
  }

  // Parse props from reactDocgen
  const rawProps = component.reactDocgen?.props || {};
  const props: ComponentProp[] = Object.entries(rawProps).map(
    ([propName, propInfo]) => {
      const description = propInfo.description || '';
      return {
        name: propName,
        type: propInfo.tsType?.name || 'unknown',
        required: propInfo.required || false,
        description,
        defaultValue: propInfo.defaultValue?.value,
        deprecated:
          description.toLowerCase().includes('@deprecated') ||
          description.toLowerCase().includes('@ignore'),
      };
    }
  );

  return {
    name: component.name,
    description: component.description || '',
    packageName,
    importStatement: component.import,
    props,
    stories: component.stories || [],
  };
}
