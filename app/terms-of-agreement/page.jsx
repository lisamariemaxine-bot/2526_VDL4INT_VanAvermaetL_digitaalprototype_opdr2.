// pages/terms-of-agreement.js
export default function TermsOfAgreement() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Terms of Agreement</h1>
          
        <p className="mb-6 text-gray-600">
          Please read these Terms of Agreement carefully before using our website or services. By accessing or using our site, you agree to comply with these terms and conditions.
        </p>

        <div className="space-y-6">

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
            <p className="text-gray-600">
              By using our website, you agree to be bound by these Terms of Agreement, as well as any additional terms, policies, or guidelines posted on the site.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
            <p className="text-gray-600">
              Users must provide accurate information, respect the rights of others, and refrain from using the site for unlawful purposes. Any violation may result in suspension or termination of access.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Account Registration</h2>
            <p className="text-gray-600">
              Some features may require account registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
            <p className="text-gray-600">
              All content on this site is protected by copyright, trademark, or other intellectual property laws. Users may not copy, distribute, or modify content without proper authorization.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
            <p className="text-gray-600">
              We are not liable for any damages arising from the use of this website or services, including direct, indirect, incidental, or consequential losses.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Modifications of Terms</h2>
            <p className="text-gray-600">
              We reserve the right to update or modify these Terms of Agreement at any time. Continued use of the site after changes constitutes acceptance of the updated terms.
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">Accept Terms</button>
          <button className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition">Decline</button>
        </div>

    </div>
  )
}
