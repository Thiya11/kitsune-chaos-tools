'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const GA_ID = 'G-5N1HJ31LJM'

function loadGA() {
  if (typeof window === 'undefined') return
  if (window.location.hostname !== 'kitsunechaos.com') return
  if ((window as any).__gaLoaded) return
  ;(window as any).__gaLoaded = true

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  ;(window as any).dataLayer = (window as any).dataLayer || []
  function gtag(...args: any[]) { (window as any).dataLayer.push(args) }
  ;(window as any).gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)
}

function disableGA() {
  ;(window as any)[`ga-disable-${GA_ID}`] = true
}

export function CookieConsentManager() {
  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [{ name: /^(_ga|_gid|_gat)/ }],
          },
        },
      },

      onConsent: () => {
        if (CookieConsent.acceptedCategory('analytics')) loadGA()
      },

      onChange: () => {
        if (CookieConsent.acceptedCategory('analytics')) {
          loadGA()
        } else {
          disableGA()
        }
      },

      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description:
                'We use analytics cookies (Google Analytics) to understand how people use our tools. No personal data is sold.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
              footer: '<a href="/privacy">Privacy policy</a>',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Necessary cookies',
                  description:
                    'These cookies are required for the site to function and cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics cookies',
                  description:
                    'We use Google Analytics to see which tools are popular and how we can improve. All data is anonymised.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
    })
  }, [])

  return null
}
