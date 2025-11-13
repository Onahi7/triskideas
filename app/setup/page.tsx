export const metadata = {
  title: "Setup - TRISKIDEAS",
  robots: { index: false },
}

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Setup Guide</h1>

        <div className="space-y-8">
          <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Initial Setup</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <span>
                  Read the <code className="bg-gray-100 px-2 py-1 rounded">SETUP.md</code> file in the root directory
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <span>
                  Configure environment variables in <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <span>Setup Neon database and run migrations</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <span>Configure Cloudinary for image uploads</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </span>
                <span>Setup Resend for email notifications</span>
              </li>
            </ol>
          </section>

          <section className="bg-blue-50 rounded-lg p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Required Services</h2>
            <ul className="space-y-3 text-blue-800">
              <li>
                ✓ <strong>Neon Database</strong> - PostgreSQL for blog, events, and subscriber data
              </li>
              <li>
                ✓ <strong>Cloudinary</strong> - Image upload and hosting
              </li>
              <li>
                ✓ <strong>Resend</strong> - Email notifications
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 rounded-lg p-8 border-l-4 border-amber-500">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Admin Access</h2>
            <p className="text-amber-900 mb-4">
              Access the admin dashboard at <code className="bg-white px-2 py-1 rounded">/admin</code>
            </p>
            <p className="text-amber-800">
              Default credentials are in your .env.local file. Change these in production!
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
