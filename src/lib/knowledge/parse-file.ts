export async function extractTextFromFile(file: File) {
  const name=file.name.toLowerCase();
  if(file.type.startsWith("text/") || /\.(txt|md|csv|json|html?)$/.test(name)) return await file.text();

  const buffer=Buffer.from(await file.arrayBuffer());

  if(file.type==="application/pdf" || name.endsWith(".pdf")){
    const { PDFParse } = await import("pdf-parse");
    const parser=new PDFParse({data:new Uint8Array(buffer)});
    try{
      const result=await parser.getText();
      return result.text;
    }finally{
      await parser.destroy();
    }
  }

  if(file.type==="application/vnd.openxmlformats-officedocument.wordprocessingml.document" || name.endsWith(".docx")){
    const mammoth=await import("mammoth");
    const result=await mammoth.extractRawText({buffer});
    return result.value;
  }

  throw new Error("Format non pris en charge. Utilisez PDF, DOCX, TXT, MD, CSV, JSON ou HTML.");
}
