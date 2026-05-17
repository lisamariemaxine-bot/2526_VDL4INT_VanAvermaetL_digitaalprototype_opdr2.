// pages/cookie-settings.js
export default function CookieSettings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Settings</h1>
     
      <div className="space-y-6">

        <p className="mb-6 text-gray-600">
          We use cookies to enhance your experience on our website, analyze site traffic, and provide personalized content. Some cookies are essential for the site to function, while others help us improve your experience.
        </p>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Essential Cookies</h2>
            <p className="text-gray-600">
              These cookies are necessary for the website to function and cannot be turned off. They ensure basic functionalities such as page navigation, security, and access to secure areas of the site.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Performance & Analytics Cookies</h2>
            <p className="text-gray-600">
              These cookies help us understand how visitors interact with our website, allowing us to improve performance and provide a better user experience.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Functional Cookies</h2>
            <p className="text-gray-600">
              Functional cookies enable enhanced features and personalization, such as remembering your preferences or login information.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Advertising & Targeting Cookies</h2>
            <p className="text-gray-600">
              These cookies are used to deliver relevant advertisements based on your interests and browsing behavior. They may also limit the number of times you see an ad and help measure ad campaign effectiveness.
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">Accept All</button>
          <button className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition">Reject Non-Essential</button>
          <button className="flex-1 bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition">Customize Settings</button>
        </div>
    </div>

  )
}
