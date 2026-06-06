import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  buildPageTitle,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  type AppSeoOptions,
} from '~/utils/seo'

type ReactiveAppSeoOptions = {
  title?: MaybeRef<string | undefined>
  description?: MaybeRef<string | undefined>
  path?: MaybeRef<string | undefined>
  noIndex?: MaybeRef<boolean | undefined>
  ogType?: AppSeoOptions['ogType']
}

export function useAppSeo(options: ReactiveAppSeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = String(config.public.siteUrl ?? '').replace(/\/$/, '')

  const title = computed(() => buildPageTitle(toValue(options.title)))
  const description = computed(() => toValue(options.description) ?? DEFAULT_DESCRIPTION)
  const path = computed(() => toValue(options.path) ?? route.path)
  const robots = computed(() =>
    toValue(options.noIndex) ? 'noindex, nofollow' : 'index, follow',
  )
  const canonical = computed(() => (siteUrl ? `${siteUrl}${path.value}` : undefined))

  useSeoMeta({
    title,
    description,
    keywords: DEFAULT_KEYWORDS,
    robots,
    ogTitle: title,
    ogDescription: description,
    ogType: options.ogType ?? 'website',
    ogUrl: canonical,
    ogSiteName: SITE_NAME,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
  })

  useHead({
    link: computed(() =>
      canonical.value ? [{ rel: 'canonical', href: canonical.value }] : [],
    ),
  })
}

export function useAppStructuredData(data: Record<string, unknown>) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data),
      },
    ],
  })
}
