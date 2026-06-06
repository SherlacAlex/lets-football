export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl ?? '').replace(/\/$/, '')

  if (!siteUrl) {
    setResponseHeader(event, 'content-type', 'text/plain')
    return 'Sitemap unavailable: set NUXT_PUBLIC_SITE_URL'
  }

  const pages = [
    { loc: '/welcome', changefreq: 'weekly', priority: '1.0' },
    { loc: '/rules', changefreq: 'monthly', priority: '0.8' },
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return body
})
