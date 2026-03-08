// import { jsPDF } from "jspdf"
// import { VocabularyItem } from "@/interfaces/newsletter.interface"

// /**
//  * Generates a PDF showing vocabulary words with their images.
//  * Layout: 2x2 grid (4 items per page) on A4/Letter size.
//  */
// export const generateVocabularyPDF = async (vocabularies: VocabularyItem[], title: string, dateStr: string) => {
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4",
//   })

//   const pageWidth = doc.internal.pageSize.getWidth()
//   const pageHeight = doc.internal.pageSize.getHeight()
//   const margin = 10
//   const gap = 10

//   // 2x2 layout constants
//   const cols = 2
//   const rows = 2
//   const cellWidth = (pageWidth - (margin * 2) - gap) / cols
//   const cellHeight = (pageHeight - (margin * 2) - gap - 20) / rows // Leave some space for header

//   // Helper to load image and convert to base64
//   const loadImage = (url: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image()
//       img.crossOrigin = "anonymous"
//       img.src = url
//       img.onload = () => {
//         const canvas = document.createElement("canvas")
//         canvas.width = img.width
//         canvas.height = img.height
//         const ctx = canvas.getContext("2d")
//         if (!ctx) {
//           reject("Could not get canvas context")
//           return
//         }
//         ctx.drawImage(img, 0, 0)
//         resolve(canvas.toDataURL("image/jpeg", 0.8))
//       }
//       img.onerror = (e) => reject(e)
//     })
//   }

//   // Draw header once at the start
//   const drawHeader = () => {
//     doc.setFontSize(18)
//     doc.setTextColor(41, 37, 36) // primary color roughly
//     doc.text("Vocabulary List", margin, margin + 10)
//     doc.setFontSize(12)
//     doc.setTextColor(120, 113, 108) // muted-foreground
//     doc.text(`${title} - ${dateStr}`, margin, margin + 18)
//     doc.setDrawColor(231, 229, 228) // border color
//     doc.line(margin, margin + 22, pageWidth - margin, margin + 22)
//   }

//   drawHeader()

//   let currentItem = 0
//   for (let i = 0; i < vocabularies.length; i++) {
//     const vocab = vocabularies[i]

//     // Check if we need a new page
//     if (i > 0 && i % (cols * rows) === 0) {
//       doc.addPage()
//       drawHeader()
//       currentItem = 0
//     }

//     const col = currentItem % cols
//     const row = Math.floor(currentItem / cols)

//     const x = margin + (col * (cellWidth + gap))
//     const y = margin + 25 + (row * (cellHeight + gap))

//     // Draw box
//     doc.setDrawColor(231, 229, 228)
//     doc.roundedRect(x, y, cellWidth, cellHeight, 3, 3)

//     try {
//       if (vocab.imageUrl) {
//         const base64Img = await loadImage(vocab.imageUrl)

//         // Image dimensions (making square-ish inside cell)
//         const imgSize = Math.min(cellWidth - 10, cellHeight - 20)
//         const imgX = x + (cellWidth - imgSize) / 2
//         const imgY = y + 5

//         doc.addImage(base64Img, "JPEG", imgX, imgY, imgSize, imgSize)
//       }
//     } catch (error) {
//       console.error(`Failed to load image for ${vocab.word}:`, error)
//       // If image fails, we just don't draw it, or draw a placeholder
//       doc.setFontSize(10)
//       doc.text("Image not available", x + cellWidth / 2, y + cellHeight / 2 - 5, { align: "center" })
//     }

//     // Draw word
//     doc.setFontSize(22)
//     doc.setFont("helvetica", "bold")
//     doc.setTextColor(41, 37, 36)
//     doc.text(vocab.word, x + cellWidth / 2, y + cellHeight - 8, { align: "center" })

//     currentItem++
//   }

//   const filename = `Vocabulary-${dateStr.replace(/\s+/g, "-")}.pdf`
//   doc.save(filename)
// }
import { jsPDF } from "jspdf"
import { VocabularySet } from "@/interfaces/newsletter.interface"

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
        const isFullUrl = image.imageUrl.startsWith("http") || image.imageUrl.startsWith("/") || image.imageUrl.startsWith("data:")
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const imageUrl = isFullUrl ? image.imageUrl : `https://res.cloudinary.com/${cloudName}/image/upload/${image.imageUrl}`

        const imgData = await loadImage(imageUrl)

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
