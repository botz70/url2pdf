import { useState, useRef } from 'react'
import { Download, Link2, Loader2 } from 'lucide-react'
import html2pdf from 'html2pdf.js'

function App() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setError('')

    try {
      // Create a hidden iframe to load the URL content
      const iframe = iframeRef.current
      if (!iframe) return

      iframe.onload = () => {
        const content = iframe.contentDocument?.documentElement.outerHTML
        if (!content) {
          setError('Failed to load page content')
          return
        }

        const opt = {
          margin: 10,
          filename: 'document.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().from(content).set(opt).save()
        setIsLoading(false)
      }

      iframe.src = url
    } catch (err) {
      setError('An error occurred while generating PDF')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="w-6 h-6" />
            URL to PDF Converter
          </h1>
          <p className="text-indigo-100 mt-1">
            Convert any webpage to a downloadable PDF file
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Webpage URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Convert to PDF
                </>
              )}
            </button>

            {error && (
              <div className="text-red-500 text-sm text-center py-2">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-2">How it works</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>Enter the URL of the webpage you want to convert</li>
            <li>Click "Convert to PDF" button</li>
            <li>Wait for processing to complete</li>
            <li>Your PDF will automatically download</li>
          </ol>
        </div>

        {/* Hidden iframe for loading content */}
        <iframe
          ref={iframeRef}
          className="absolute opacity-0 w-0 h-0"
          title="hidden-iframe"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  )
}

export default App
