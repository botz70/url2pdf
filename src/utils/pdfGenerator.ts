import html2pdf from 'html2pdf.js'

export async function generatePdfFromUrl(url: string) {
  try {
    // Usiamo fetch con un proxy CORS per ottenere l'HTML
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    if (!response.ok || !data.contents) {
      throw new Error('Failed to fetch page content')
    }

    const opt = {
      margin: 10,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    // Creiamo un elemento temporaneo con il contenuto
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = data.contents
    document.body.appendChild(tempDiv)

    await html2pdf().from(tempDiv).set(opt).save()
    
    // Pulizia
    document.body.removeChild(tempDiv)
    
    return true
  } catch (error) {
    console.error('PDF generation error:', error)
    throw error
  }
}
