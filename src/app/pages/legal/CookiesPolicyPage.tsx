import { Link } from 'react-router';
import { LegalPageLayout, LegalP, LegalUl } from '../../components/legal/LegalPageLayout';

const LAST_UPDATED = '5 August 2026';
const CONTACT = 'odistudio24@gmail.com';

export default function CookiesPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Cookies"
      titleAccent="Policy"
      lastUpdated={LAST_UPDATED}
      intro="This Cookies Policy explains how ODI Studio uses cookies and similar technologies when you visit our website."
      sections={[
        {
          id: 'what-are-cookies',
          title: 'What are cookies?',
          content: (
            <>
              <LegalP>
                Cookies are small text files stored on your device when you visit a website. They help the site remember
                preferences, keep you signed in, and understand how pages are used. Similar technologies include local
                storage and session storage.
              </LegalP>
            </>
          ),
        },
        {
          id: 'how-we-use',
          title: 'How we use cookies',
          content: (
            <>
              <LegalUl>
                <li>
                  <strong className="text-neutral-800">Essential</strong> — required for security, authentication,
                  checkout flow, and basic site operation. These cannot be disabled if you want to use signed-in features
                  or complete a purchase.
                </li>
                <li>
                  <strong className="text-neutral-800">Functional</strong> — remember choices such as cart contents,
                  checkout progress, or UI preferences stored locally in your browser.
                </li>
                <li>
                  <strong className="text-neutral-800">Analytics</strong> — help us understand traffic and improve the
                  site. We use these only where configured and in line with our{' '}
                  <Link to="/privacy" className="font-bold text-neutral-900 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </li>
              </LegalUl>
            </>
          ),
        },
        {
          id: 'third-party',
          title: 'Third-party cookies',
          content: (
            <>
              <LegalP>Some cookies are set by services we integrate with, such as:</LegalP>
              <LegalUl>
                <li>Firebase Authentication (sign-in sessions)</li>
                <li>Razorpay (payment checkout where applicable)</li>
                <li>Embedded media or analytics providers when enabled</li>
              </LegalUl>
              <LegalP>
                These providers may process data according to their own policies. We encourage you to review their
                documentation where relevant.
              </LegalP>
            </>
          ),
        },
        {
          id: 'local-storage',
          title: 'Local storage',
          content: (
            <>
              <LegalP>
                In addition to cookies, we may store data in your browser’s local storage — for example saved checkout
                addresses, cart items, or session preferences. You can clear this data through your browser settings;
                doing so may sign you out or reset checkout progress.
              </LegalP>
            </>
          ),
        },
        {
          id: 'your-choices',
          title: 'Your choices',
          content: (
            <>
              <LegalUl>
                <li>Block or delete cookies via your browser settings.</li>
                <li>Use private/incognito mode to limit persistent storage.</li>
                <li>Disable non-essential analytics where we offer controls.</li>
              </LegalUl>
              <LegalP>
                Blocking essential cookies may prevent login, checkout, or other core features from working correctly.
              </LegalP>
            </>
          ),
        },
        {
          id: 'updates',
          title: 'Updates',
          content: (
            <>
              <LegalP>
                We may update this Cookies Policy when our technology or legal requirements change. Check the “Last
                updated” date above for the current version.
              </LegalP>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact',
          content: (
            <>
              <LegalP>
                Questions:{' '}
                <a href={`mailto:${CONTACT}`} className="font-bold text-neutral-900 underline underline-offset-2">
                  {CONTACT}
                </a>
                .
              </LegalP>
            </>
          ),
        },
      ]}
    />
  );
}
