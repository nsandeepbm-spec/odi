import { Link } from 'react-router';
import { LegalPageLayout, LegalP, LegalUl } from '../../components/legal/LegalPageLayout';

const LAST_UPDATED = '5 August 2026';
const CONTACT = 'odistudio24@gmail.com';

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of"
      titleAccent="Service"
      lastUpdated={LAST_UPDATED}
      intro="These Terms of Service govern your access to and use of the ODI Studio website, accounts, storefront, and related services operated by Oceaniek Dimension Industries."
      sections={[
        {
          id: 'acceptance',
          title: 'Acceptance of terms',
          content: (
            <>
              <LegalP>
                By accessing this website, creating an account, or placing an order, you agree to these Terms and our{' '}
                <Link to="/privacy" className="font-bold text-neutral-900 underline underline-offset-2">
                  Privacy Policy
                </Link>
                . If you do not agree, do not use the service.
              </LegalP>
            </>
          ),
        },
        {
          id: 'eligibility',
          title: 'Eligibility',
          content: (
            <>
              <LegalP>
                You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account
                or purchase products. If you use the service on behalf of a company, you represent that you have
                authority to bind that organisation.
              </LegalP>
            </>
          ),
        },
        {
          id: 'accounts',
          title: 'Accounts',
          content: (
            <>
              <LegalUl>
                <li>You are responsible for keeping your login credentials secure.</li>
                <li>You must provide accurate registration and checkout information.</li>
                <li>We may suspend or terminate accounts that violate these Terms or applicable law.</li>
                <li>We may refuse service, limit quantities, or cancel orders at our discretion where permitted by law.</li>
              </LegalUl>
            </>
          ),
        },
        {
          id: 'products-orders',
          title: 'Products & orders',
          content: (
            <>
              <LegalUl>
                <li>
                  Product descriptions, images, and prices are subject to change. We strive for accuracy but do not
                  warrant that all content is error-free.
                </li>
                <li>
                  An order is confirmed when payment is successfully authorised (online) or when we accept a cash-on-delivery
                  order according to our checkout rules.
                </li>
                <li>
                  Physical products are subject to availability. If an item becomes unavailable after purchase, we will
                  contact you about cancellation or substitution.
                </li>
                <li>Prices are shown in Indian Rupees (INR) unless stated otherwise; taxes and shipping are shown at checkout.</li>
              </LegalUl>
            </>
          ),
        },
        {
          id: 'payments',
          title: 'Payments',
          content: (
            <>
              <LegalP>
                Online payments are processed by Razorpay or other authorised payment partners. You agree to their terms
                when completing payment. We do not store your full payment card details on our servers.
              </LegalP>
              <LegalP>
                For cash on delivery (COD), payment is due upon delivery as shown at checkout. Failed or refused COD
                deliveries may affect future order eligibility.
              </LegalP>
            </>
          ),
        },
        {
          id: 'shipping',
          title: 'Shipping & delivery',
          content: (
            <>
              <LegalP>
                We ship physical products within India using third-party courier partners. Estimated delivery times are
                indicative only and not guaranteed. Risk of loss passes to you upon delivery to the address you provide.
              </LegalP>
              <LegalP>
                You are responsible for providing a complete and accurate shipping address. We are not liable for delays
                caused by incorrect addresses, customs processes (if applicable), or events outside our reasonable control.
              </LegalP>
            </>
          ),
        },
        {
          id: 'returns',
          title: 'Returns, refunds & cancellations',
          content: (
            <>
              <LegalP>
                Return and refund eligibility depends on product condition, time since delivery, and the reason for the
                request. Contact us at{' '}
                <a href={`mailto:${CONTACT}`} className="font-bold text-neutral-900 underline underline-offset-2">
                  {CONTACT}
                </a>{' '}
                with your order number before returning any item.
              </LegalP>
              <LegalP>
                Approved refunds for online payments will be processed to the original payment method where possible.
                Processing times may vary depending on your bank or payment provider.
              </LegalP>
            </>
          ),
        },
        {
          id: 'services',
          title: 'Creative & B2B services',
          content: (
            <>
              <LegalP>
                Separate statements of work, proposals, or contracts may apply to stereo conversion, 3D production, and
                other professional services. Where those documents conflict with these Terms, the project-specific
                agreement prevails.
              </LegalP>
            </>
          ),
        },
        {
          id: 'ip',
          title: 'Intellectual property',
          content: (
            <>
              <LegalP>
                All website content, branding, product designs, software, and media (unless credited otherwise) are owned
                by ODI Studio or its licensors. You may not copy, modify, distribute, or reverse engineer our materials
                without written permission.
              </LegalP>
              <LegalP>
                User reviews and content you submit grant us a non-exclusive licence to display and use that content in
                connection with the service.
              </LegalP>
            </>
          ),
        },
        {
          id: 'prohibited',
          title: 'Prohibited use',
          content: (
            <>
              <LegalUl>
                <li>Violating laws or third-party rights.</li>
                <li>Attempting unauthorised access to systems, accounts, or data.</li>
                <li>Uploading malware, spam, or harmful code.</li>
                <li>Reselling products in violation of applicable restrictions or fraudulently claiming chargebacks.</li>
              </LegalUl>
            </>
          ),
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer & limitation of liability',
          content: (
            <>
              <LegalP>
                The service is provided “as is” and “as available” to the fullest extent permitted by law. We disclaim
                warranties of merchantability, fitness for a particular purpose, and non-infringement where allowed.
              </LegalP>
              <LegalP>
                To the maximum extent permitted by law, ODI Studio shall not be liable for indirect, incidental, special,
                or consequential damages, or for amounts exceeding the fees you paid to us for the relevant order in the
                twelve (12) months before the claim.
              </LegalP>
            </>
          ),
        },
        {
          id: 'governing-law',
          title: 'Governing law & disputes',
          content: (
            <>
              <LegalP>
                These Terms are governed by the laws of India. Courts in India shall have exclusive jurisdiction over
                disputes arising from these Terms, subject to mandatory consumer protection rules that may apply in your
                location.
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
                Questions about these Terms:{' '}
                <a href={`mailto:${CONTACT}`} className="font-bold text-neutral-900 underline underline-offset-2">
                  {CONTACT}
                </a>{' '}
                or{' '}
                <Link to="/contact" className="font-bold text-neutral-900 underline underline-offset-2">
                  contact us
                </Link>
                .
              </LegalP>
            </>
          ),
        },
      ]}
    />
  );
}
