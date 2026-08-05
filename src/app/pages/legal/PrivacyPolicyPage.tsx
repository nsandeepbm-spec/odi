import { LegalPageLayout, LegalP, LegalUl } from '../../components/legal/LegalPageLayout';

const LAST_UPDATED = '5 August 2026';
const CONTACT = 'odistudio24@gmail.com';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy"
      titleAccent="Policy"
      lastUpdated={LAST_UPDATED}
      intro="This Privacy Policy explains how Oceaniek Dimension Industries (“ODI Studio”, “we”, “us”) collects, uses, and protects personal information when you use our website, storefront, and related services."
      sections={[
        {
          id: 'who-we-are',
          title: 'Who we are',
          content: (
            <>
              <LegalP>
                ODI Studio operates this website and related digital services for stereoscopic media,
                immersive products, and physical learning kits. Our contact email for privacy matters is{' '}
                <a href={`mailto:${CONTACT}`} className="font-bold text-neutral-900 underline underline-offset-2">
                  {CONTACT}
                </a>
                .
              </LegalP>
            </>
          ),
        },
        {
          id: 'information-we-collect',
          title: 'Information we collect',
          content: (
            <>
              <LegalP>We may collect the following categories of information:</LegalP>
              <LegalUl>
                <li>
                  <strong className="text-neutral-800">Account data</strong> — name, email address, profile
                  photo (if you sign in with Google), and authentication identifiers when you register or sign in.
                </li>
                <li>
                  <strong className="text-neutral-800">Order &amp; checkout data</strong> — shipping address,
                  phone number, order history, payment references (processed by Razorpay; we do not store full card
                  numbers on our servers).
                </li>
                <li>
                  <strong className="text-neutral-800">Communications</strong> — messages you send via contact,
                  careers, or support forms; support ticket content when you use in-app support.
                </li>
                <li>
                  <strong className="text-neutral-800">Preferences</strong> — wishlist, “Notify Me” subscriptions,
                  and notification read status when you are signed in.
                </li>
                <li>
                  <strong className="text-neutral-800">Technical data</strong> — browser type, device information,
                  IP address, and usage logs needed to secure and operate the service.
                </li>
              </LegalUl>
            </>
          ),
        },
        {
          id: 'how-we-use',
          title: 'How we use your information',
          content: (
            <>
              <LegalUl>
                <li>Create and manage your account.</li>
                <li>Process orders, payments, shipping, and customer support.</li>
                <li>Send transactional emails (welcome, order confirmation, shipping updates, product launch alerts).</li>
                <li>Send in-app notifications about orders and account activity.</li>
                <li>Improve our website, products, and security.</li>
                <li>Comply with applicable law and respond to lawful requests.</li>
              </LegalUl>
              <LegalP>
                We do not sell your personal information to third parties for their marketing purposes.
              </LegalP>
            </>
          ),
        },
        {
          id: 'sharing',
          title: 'When we share information',
          content: (
            <>
              <LegalP>We share data only as needed to run the service, including with:</LegalP>
              <LegalUl>
                <li>
                  <strong className="text-neutral-800">Payment partners</strong> — e.g. Razorpay, to process online
                  payments securely.
                </li>
                <li>
                  <strong className="text-neutral-800">Shipping partners</strong> — e.g. courier services, to deliver
                  physical products to your address.
                </li>
                <li>
                  <strong className="text-neutral-800">Infrastructure providers</strong> — hosting, database, email,
                  and authentication services that process data on our behalf under contractual safeguards.
                </li>
                <li>
                  <strong className="text-neutral-800">Professional advisers</strong> — where required for legal,
                  accounting, or compliance purposes.
                </li>
              </LegalUl>
            </>
          ),
        },
        {
          id: 'retention',
          title: 'Data retention',
          content: (
            <>
              <LegalP>
                We keep personal information for as long as your account is active or as needed to fulfil orders,
                resolve disputes, enforce agreements, and meet legal obligations. Order and payment records may be
                retained for accounting and tax purposes even after account closure.
              </LegalP>
            </>
          ),
        },
        {
          id: 'your-rights',
          title: 'Your choices & rights',
          content: (
            <>
              <LegalUl>
                <li>Update profile details in your account settings where available.</li>
                <li>Request access, correction, or deletion of personal data by emailing us.</li>
                <li>Opt out of non-essential marketing emails using unsubscribe links where provided.</li>
                <li>Manage in-app notifications from your dashboard inbox where supported.</li>
              </LegalUl>
              <LegalP>
                Depending on your location, you may have additional rights under applicable privacy laws. We will
                respond to verified requests within a reasonable timeframe.
              </LegalP>
            </>
          ),
        },
        {
          id: 'security',
          title: 'Security',
          content: (
            <>
              <LegalP>
                We use industry-standard measures including encrypted connections (HTTPS), authenticated API access,
                and restricted database access. No method of transmission over the internet is 100% secure; we
                cannot guarantee absolute security.
              </LegalP>
            </>
          ),
        },
        {
          id: 'children',
          title: 'Children',
          content: (
            <>
              <LegalP>
                Our products are designed for children to use with adult supervision, but account registration and
                purchases must be completed by a parent or legal guardian aged 18 or older. We do not knowingly
                collect personal information directly from children under 13 without appropriate consent.
              </LegalP>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          content: (
            <>
              <LegalP>
                We may update this Privacy Policy from time to time. The “Last updated” date at the top will change
                when we do. Continued use of the site after changes constitutes acceptance of the updated policy.
              </LegalP>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact us',
          content: (
            <>
              <LegalP>
                Questions about this Privacy Policy or your data:{' '}
                <a href={`mailto:${CONTACT}`} className="font-bold text-neutral-900 underline underline-offset-2">
                  {CONTACT}
                </a>{' '}
                or via our{' '}
                <a href="/contact" className="font-bold text-neutral-900 underline underline-offset-2">
                  contact form
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
