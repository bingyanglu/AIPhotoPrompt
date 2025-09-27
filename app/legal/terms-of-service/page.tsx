import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SimpleHero } from '@/components/HeroSection'

export const metadata: Metadata = {
  title: 'Terms of Service - AI Photo Prompt Lab',
  description: 'Understand the terms that govern your use of AI Photo Prompt Lab, including prompt library access, acceptable use, and limitations.',
  alternates: {
    canonical: 'https://www.aiphotoprompt.net/legal/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <SimpleHero
          title="Terms of Service"
          description="These terms explain how you may use the AI Photo Prompt Lab website, prompt library, and related resources."
        />

        <section className="py-16">
          <div className="container-custom mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-gray-700">
            <section>
              <h2 className="font-display text-2xl text-gray-900">1. Acceptance of Terms</h2>
              <p className="mt-4">
                By accessing AI Photo Prompt Lab you agree to abide by these Terms of Service and all applicable laws. If you do not agree, please do
                not use the site or copy prompts from our library.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">2. Use of Content</h2>
              <p className="mt-4">
                You may copy and adapt the Gemini prompts published on this site for personal or commercial projects, provided you do not resell the
                content as-is or misrepresent it as proprietary. Attribution is appreciated but not required.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">3. Account and Newsletter</h2>
              <p className="mt-4">
                Signing up for the newsletter through Substack constitutes consent to receive periodic emails. You are responsible for keeping your
                contact information accurate and for safeguarding access to your inbox.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">4. Acceptable Use</h2>
              <p className="mt-4">
                You agree not to misuse the site by scraping at scale, interfering with functionality, or distributing malicious code. We may suspend
                access to protect the service or other users if suspicious activity is detected.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">5. Intellectual Property</h2>
              <p className="mt-4">
                All site design elements, copy, and brand assets belong to AI Photo Prompt Lab. Third-party marks, such as Google Gemini, remain the
                property of their respective owners and are referenced for descriptive purposes only.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">6. Disclaimer of Warranties</h2>
              <p className="mt-4">
                AI Photo Prompt Lab is provided “as is.” We do not guarantee the accuracy, reliability, or suitability of any prompts for a specific
                outcome. You are responsible for verifying outputs generated from our prompts.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">7. Limitation of Liability</h2>
              <p className="mt-4">
                To the fullest extent permitted by law, AI Photo Prompt Lab will not be liable for indirect, incidental, or consequential damages
                arising from your use of the site or content, including lost profits, data, or business opportunities.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">8. Changes to the Service</h2>
              <p className="mt-4">
                We may modify or discontinue features at any time. We will announce significant changes on the site or via the newsletter. Continued use
                after an update constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">9. Governing Law</h2>
              <p className="mt-4">
                These terms are governed by the laws of the jurisdiction where AI Photo Prompt Lab operates. Any disputes will be handled in the local
                courts of that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gray-900">10. Contact</h2>
              <p className="mt-4">
                Questions about these Terms of Service can be sent to <a className="text-gray-900 underline" href="mailto:hello@aiphotoprompt.net">hello@aiphotoprompt.net</a>.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
