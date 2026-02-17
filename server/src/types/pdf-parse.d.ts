declare module 'pdf-parse' {
  interface PDFData {
    text: string
    numpages: number
    info: Record<string, unknown>
  }
  interface PDFOptions {
    pagerender?: (pageData: any) => Promise<string>
    max?: number
    version?: string
  }
  function pdfParse(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>
  export = pdfParse
}
