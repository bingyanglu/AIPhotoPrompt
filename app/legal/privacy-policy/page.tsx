import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SimpleHero } from '@/components/HeroSection'

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Photo Prompt Lab',
  description: 'Learn how AI Photo Prompt Lab collects, uses, and protects your data across Gemini AI prompt collections and the newsletter.',
  alternates: {
    canonical: 'https://www.aiphotoprompt.net/legal/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <SimpleHero
          title="Privacy Policy"
          description="We respect the creators who rely on our Gemini AI prompt library. This policy explains what information we collect, how we use it, and the choices you have."
        />

        <section className="py-16">
          <div className="container-custom mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-gray-700">
            <section>
              <h2 className="font-display text-2xl text-gray-900">1. Information We Collect</h2>
              <p className="mt-4">
                We collect only the data needed to operate AI Photo Prompt Lab and improve your experience. This includes contact information you
                provide when joining the newsletter, basic analytics such as page views and copy button interactions, and any details you send when
                contacting us for support or collaboration.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">2. How Your Data Is Used</h2>
              <p className="mt-4">
                We use your information to deliver curated prompt collections, send newsletter updates, analyse feature adoption, and keep the site
                secure. We never sell personal data. Aggregated metrics may be used to showcase trends such as the most copied Gemini prompts or
                popular prompt categories.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">3. Cookies and Analytics</h2>
              <p className="mt-4">
                We rely on privacy-friendly analytics and Google Tag Manager to understand how visitors navigate the site. These tools may set
                cookies or collect anonymised usage data. You can disable cookies in your browser if you prefer; core features such as copying prompts
                will continue to work.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">4. Newsletter</h2>
              <p className="mt-4">
                When you subscribe to the newsletter we store your email address with Substack, our email provider. You can unsubscribe at any time
                using the link inside each email or by contacting us directly. We will only use your email to share AI Photo Prompt Lab announcements
                and curated Gemini prompt drops.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">5. Data Retention and Security</h2>
              <p className="mt-4">
                We retain personal information only for as long as necessary to deliver services or meet legal obligations. Access to any stored data is
                restricted to the small team operating AI Photo Prompt Lab, and we use encrypted connections for all traffic.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">6. Your Rights</h2>
              <p className="mt-4">
                You can request access to, correction of, or deletion of your personal data by emailing <a className="text-gray-900 underline" href="mailto:hello@aiphotoprompt.net">hello@aiphotoprompt.net</a>.
                If you are based in the EU or UK you also have the right to lodge a complaint with your local data protection authority.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">7. Updates to This Policy</h2>
              <p className="mt-4">
                We may update this privacy policy as we launch new Gemini prompt features or integrate additional tools. The revision date will always
                be noted at the top of the page. Significant changes will be communicated through the newsletter or in-product notices.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">8. Contact</h2>
              <p className="mt-4">
                Questions about privacy can be directed to <a className="text-gray-900 underline" href="mailto:hello@aiphotoprompt.net">hello@aiphotoprompt.net</a>.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
