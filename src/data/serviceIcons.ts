// Official AWS Architecture Icons, one SVG per service id in src/assets/aws-icons.
// Services without their own icon (e.g. Security Groups, Free Tier) use the icon
// of their AWS category instead. Vite turns each file into a hashed asset URL,
// so the SVGs are fetched only when a card that shows them is rendered.

const modules = import.meta.glob<string>('../assets/aws-icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Service id -> icon URL. */
export const SERVICE_ICON_URLS: ReadonlyMap<string, string> = new Map(
  Object.entries(modules).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1, -'.svg'.length),
    url,
  ]),
)

/** Icon URL for a service id, or undefined when no icon file exists. */
export function serviceIconUrl(id: string): string | undefined {
  return SERVICE_ICON_URLS.get(id)
}
