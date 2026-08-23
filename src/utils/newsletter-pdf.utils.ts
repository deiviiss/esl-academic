import { jsPDF } from "jspdf"
import { VocabularySet } from "@/interfaces/newsletter.interface"

/**
 * Generates a printable vocabulary flashcard PDF document from a VocabularySet.
 */
export const generateVocabularyPDF = async (
  set: VocabularySet,
  newsletterTitle: string,
  dateStr: string
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  const margin = 10
  const gap = 5

  const cols = 2
  const rows = 2

  const cellWidth = (pageWidth - margin * 2 - gap) / cols
  const cellHeight = (pageHeight - margin * 2 - gap - 25) / rows

  const loadImage = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = url
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject("Canvas error")
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL("image/jpeg", 0.85))
      }
      img.onerror = reject
    })

  const drawHeader = () => {
    doc.setFontSize(16)
    doc.setTextColor(41, 37, 36)
    doc.text(`${newsletterTitle} - ${set.name}`, margin, margin + 10)

    doc.setFontSize(11)
    doc.setTextColor(120, 113, 108)
    doc.text(`Vocabulary Set - ${dateStr}`, margin, margin + 17)

    doc.setDrawColor(231, 229, 228)
    doc.line(margin, margin + 21, pageWidth - margin, margin + 21)
  }

  drawHeader()

  // Sort images by order
  const sortedImages = [...set.images].sort((a, b) => a.order - b.order)
  let currentItem = 0

  for (let i = 0; i < sortedImages.length; i++) {
    if (i > 0 && i % (cols * rows) === 0) {
      doc.addPage()
      drawHeader()
      currentItem = 0
    }

    const image = sortedImages[i]
    const col = currentItem % cols
    const row = Math.floor(currentItem / cols)

    const x = margin + col * (cellWidth + gap)
    const y = margin + 25 + row * (cellHeight + gap)

    doc.setDrawColor(231, 229, 228)
    doc.roundedRect(x, y, cellWidth, cellHeight, 3, 3)

    // IMAGE
    try {
      if (image.imageUrl) {
        // image.imageUrl is provided as a server-signed delivery URL
        const imgData = await loadImage(image.imageUrl)

        // Use more of the cell since no text is needed
        const imgPadding = 4
        const maxImgWidth = cellWidth - imgPadding * 2
        const maxImgHeight = cellHeight - imgPadding * 2

        doc.addImage(imgData, "JPEG", x + imgPadding, y + imgPadding, maxImgWidth, maxImgHeight, undefined, 'FAST')
      }
    } catch (error) {
      console.error("Error loading image for PDF:", error)
      doc.setFontSize(9)
      doc.text("Image not available", x + cellWidth / 2, y + cellHeight / 2, {
        align: "center",
      })
    }

    currentItem++
  }

  const safeSetName = set.name.replace(/\s+/g, "-")
  doc.save(`Vocabulary-${safeSetName}-${dateStr.replace(/\s+/g, "-")}.pdf`)
}
