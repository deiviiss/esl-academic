'use client'

import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"


export default function TermsOfServicePage() {
  const lastUpdated = "March 1, 2026"

  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`${titleFont.className} text-4xl md:text-5xl font-bold text-primary mb-4`}>
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-12">
          Ms. Kelly ESL Academy – Terms of Service | Last updated: {lastUpdated}
        </p>

        <div className="space-y-12 text-foreground/90 leading-relaxed">
          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Ms. Kelly ESL Academy platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>2. Account Registration</h2>
            <p className="mb-4">To access the parent dashboard and educational materials, users must create an account. When registering, you provide:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Password</li>
            </ul>
            <p className="mt-4">
              You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.
              Ms. Kelly ESL Academy reserves the right to suspend or deactivate accounts that violate these terms or misuse the platform.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>3. Platform Access</h2>
            <p className="mb-4">
              Access to newsletters and educational content is limited to authorized parents with an active account.
              The academy may grant, restrict, or revoke access at its discretion.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>4. Educational Content</h2>
            <p className="mb-4">
              All materials available on the platform, including newsletters, vocabulary images, videos, and written content, are the intellectual property of Ms. Kelly ESL Academy.
            </p>
            <p className="mb-4">Content is provided exclusively for enrolled families.</p>
            <p>
              Reproduction, redistribution, public sharing, or commercial use of materials without written permission is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>5. External Services</h2>
            <p>
              The platform may include links to external services such as WhatsApp or YouTube.
              Ms. Kelly ESL Academy is not responsible for the content, policies, or availability of third-party platforms.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>6. Limitation of Liability</h2>
            <p className="mb-4">
              The platform is provided &ldquo;as is.&rdquo; While reasonable efforts are made to ensure availability and accuracy, uninterrupted access is not guaranteed.
            </p>
            <p>
              Ms. Kelly ESL Academy is not liable for technical interruptions, external service failures, or unauthorized account access resulting from user negligence.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>7. Changes to Terms</h2>
            <p>
              These Terms of Service may be updated at any time. Continued use of the platform constitutes acceptance of any modifications.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>8. Contact</h2>
            <p>
              For questions regarding these Terms, please contact Ms. Kelly ESL Academy directly through the official communication channels provided.
            </p>
          </section>
        </div>
      </motion.div>
    </section>
  )
}
