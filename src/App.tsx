import { useState } from 'react'
import { Download, Link2, Loader2 } from 'lucide-react'
import { generatePdfFromUrl } from './utils/pdfGenerator'

function App() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setError('')

    try {
      await generatePdfFromUrl(url)
    } catch (err) {
      setError('Impossibile generare il PDF. Verifica che l\'URL sia corretto e accessibile.')
    } finally {
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
            Converti qualsiasi pagina web in un file PDF scaricabile
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL della pagina web
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
                  Elaborazione in corso...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Converti in PDF
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
          <h2 className="text-lg font-medium text-gray-800 mb-2">Come funziona</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>Inserisci l'URL della pagina web che vuoi convertire</li>
            <li>Clicca il pulsante "Converti in PDF"</li>
            <li>Attendi il completamento dell'elaborazione</li>
            <li>Il PDF verrà scaricato automaticamente</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App
