// pages/copyright-regulations.js
export default function CopyrightRegulations() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Copyright Regulations</h1>
        
      <p className="mb-6 text-gray-600">
        We respect intellectual property rights and expect our users to do the same. This page outlines our copyright policies, how to handle copyrighted material, and your responsibilities as a user.
      </p>

      <div className="space-y-6">

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">General Policy</h2>
          <p className="text-gray-600">
            All content on this website, including text, images, videos, and software, is protected by copyright laws unless otherwise stated. Unauthorized use or distribution of copyrighted material is strictly prohibited.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Fair Use & Permissions</h2>
          <p className="text-gray-600">
            Certain uses of copyrighted material may fall under fair use, such as commentary, criticism, or educational purposes. For other uses, you must obtain written permission from the copyright owner.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Reporting Copyright Infringement</h2>
          <p className="text-gray-600">
            If you believe your work has been used in violation of copyright laws on this website, please contact us immediately with a detailed report. We will investigate and take appropriate action.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
          <p className="text-gray-600">
            Users must not upload or share content that infringes on copyright. By using this website, you agree to comply with copyright laws and respect the intellectual property of others.
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Licensing Information</h2>
          <p className="text-gray-600">
            Some content may be available under licenses that allow reuse, modification, or distribution. Always check the license terms before using such material.
          </p>
        </div>

      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">Acknowledge</button>
        <button className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition">Learn More</button>
      </div>
    </div>

  )
}
