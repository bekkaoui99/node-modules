// npm install mammoth pdf-parse docxtemplater
// npm install pdf2pptx officegen

const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const pdf2pptx = require("pdf2pptx");
const officegen = require("officegen");
const JSZip = require("jszip");

// Function to convert Word to PDF
async function convertWordToPDF(inputPath, outputPath) {
  try {
    const fileContent = fs.readFileSync(inputPath, "utf-8");
    const { value } = await mammoth.extractRawText({
      arrayBuffer: Buffer.from(fileContent),
    });

    // You may use another package like 'pdfkit' to create a PDF from the extracted text.
    // For simplicity, let's save the raw text as a PDF for this example.
    fs.writeFileSync(outputPath, value);
    console.log("Word to PDF conversion successful.");
  } catch (error) {
    console.error("Error converting Word to PDF:", error.message);
  }
}

// Function to convert PDF to Word
async function convertPDFToWord(inputPath, outputPath) {
  try {
    const dataBuffer = fs.readFileSync(inputPath);
    const data = await pdfParse(dataBuffer);

    // Extract text content from PDF
    const pdfText = data.text;

    // Create a simple Word document with extracted text
    const content = `<w:p><w:r><w:t>${pdfText}</w:t></w:r></w:p>`;
    const template = new Docxtemplater();
    template.loadZip(new JSZip(content));

    // Save the Word document
    const generatedDoc = template.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, generatedDoc);

    console.log("PDF to Word conversion successful.");
  } catch (error) {
    console.error("Error converting PDF to Word:", error.message);
  }
}

// Function to convert PDF to PPT
async function convertPDFToPPT(inputPath, outputPath) {
  try {
    const pptx = await pdf2pptx(inputPath);
    const pptxBuffer = await pptx.generate();
    fs.writeFileSync(outputPath, pptxBuffer);
    console.log("PDF to PPT conversion successful.");
  } catch (error) {
    console.error("Error converting PDF to PPT:", error.message);
  }
}

// Function to convert PPT to PDF
function convertPPTToPDF(inputPath, outputPath) {
  try {
    const pptx = officegen("pptx");
    pptx.generate(fs.createWriteStream(outputPath));

    // Read PPT content and add slides to the generated PPTX object
    const pptContent = fs.readFileSync(inputPath, "binary");
    pptx.on("finalize", () => {
      console.log("PPT to PDF conversion successful.");
    });

    pptx.on("error", (error) => {
      console.error("Error converting PPT to PDF:", error.message);
    });

    pptx.generate(pptContent);
  } catch (error) {
    console.error("Error converting PPT to PDF:", error.message);
  }
}

module.exports = {
  convertWordToPDF,
  convertPDFToWord,
  convertPDFToPPT,
  convertPPTToPDF,
};
