'use client'

import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"


export default function PrivacyPolicyPage() {
  const lastUpdated = "March 1, 2026"

  return (
    <section className="container mx-auto px-4 md:px-6 py-16 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`${titleFont.className} text-4xl md:text-5xl font-bold text-primary mb-4`}>
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">
          Miss Kelly ESL Academy – Privacy Policy | Last updated: {lastUpdated}
        </p>

        <div className="space-y-12 text-foreground/90 leading-relaxed">
          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>1. Information We Collect</h2>
            <p className="mb-4">When creating an account, we collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Encrypted password</li>
              <li>Optional profile image</li>
            </ul>
            <p className="mt-4">
              We may also store basic account-related data such as account status, verification status, and activity timestamps.
            </p>
            <p className="mt-4 font-semibold text-primary">No payment information is collected through this platform.</p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>2. How We Use the Information</h2>
            <p className="mb-4">Personal information is used exclusively to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage user accounts</li>
              <li>Provide access to educational newsletters and materials</li>
              <li>Communicate important updates related to the program</li>
              <li>Maintain platform security</li>
            </ul>
            <p className="mt-4">We do not sell, rent, or trade personal data.</p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>3. Data Storage and Security</h2>
            <p className="mb-4">
              Passwords are securely encrypted. Reasonable technical measures are implemented to protect user data. However, no digital system can guarantee absolute security.
            </p>
            <p>
              User data is stored only for as long as necessary to provide the service.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>4. Third-Party Services</h2>
            <p className="mb-4">The platform may use third-party services such as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cloudinary (for image storage)</li>
              <li>Hosting providers</li>
              <li>External links such as WhatsApp or YouTube</li>
            </ul>
            <p className="mt-4">These services operate under their own privacy policies.</p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>5. User Rights</h2>
            <p className="mb-4">Users may request to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access their personal information</li>
              <li>Update incorrect data</li>
              <li>Delete their account</li>
            </ul>
            <p className="mt-4">Requests may be made through the academy’s official contact channels.</p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>6. Changes to This Policy</h2>
            <p>
              This Privacy Policy may be updated when necessary. Continued use of the platform indicates acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-4`}>7. Contact</h2>
            <p>
              For questions regarding this Privacy Policy, please contact Ms. Kelly ESL Academy through the official communication channels provided on the website.
            </p>
          </section>
        </div>
      </motion.div>
    </section>
  )
}
