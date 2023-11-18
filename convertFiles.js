const fs = require("fs");
const pdfPoppler = require("pdf-poppler");
const officegen = require("officegen");
const mammoth = require("mammoth");
const ExcelJS = require("exceljs");
const PDFLib = require("pdf-lib");

// Function to convert PDF to Word
async function convertPDFToWord(inputPath, outputPath) {
  try {
    const images = await pdfPoppler.convert(inputPath, { format: "jpeg" });
    const htmlContent = images
      .map(
        (image, index) =>
          `<img src="data:image/jpeg;base64,${fs.readFileSync(
            image,
            "base64"
          )}" alt="slide${index + 1}">`
      )
      .join("");
    const options = { styleMap: "p => div" }; // Convert paragraphs to divs
    const { value } = await mammoth.extractRawText(
      { arrayBuffer: Buffer.from(htmlContent) },
      options
    );
    fs.writeFileSync(outputPath, value);
    console.log("PDF to Word conversion successful.");
  } catch (error) {
    console.error("Error converting PDF to Word:", error.message);
  }
}

// Function to convert Word to PDF
async function convertWordToPDF(inputPath, outputPath) {
  try {
    const fileContent = fs.readFileSync(inputPath, "utf-8");
    const htmlContent = mammoth.extractRawText({
      arrayBuffer: Buffer.from(fileContent),
    });
    // You may use another package like 'pdfkit' to create a PDF from the extracted text.
    // For simplicity, let's save the raw text as a PDF for this example.
    fs.writeFileSync(outputPath, htmlContent.value);
    console.log("Word to PDF conversion successful.");
  } catch (error) {
    console.error("Error converting Word to PDF:", error.message);
  }
}

// Function to convert PDF to PPT
async function convertPDFToPPT(inputPath, outputPath) {
  try {
    const images = await pdfPoppler.convert(inputPath, { format: "jpeg" });
    const pptx = officegen("pptx");

    for (let i = 0; i < images.length; i++) {
      const imageBuffer = fs.readFileSync(images[i]);
      const slide = pptx.makeNewSlide();
      slide.addImage({ path: imageBuffer, type: "image/jpeg", x: 0, y: 0 });
    }

    pptx.generate(fs.createWriteStream(outputPath));

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

// Function to convert PDF to Excel
async function convertPDFToExcel(inputPath, outputPath) {
  try {
    const images = await pdfPoppler.convert(inputPath, { format: "jpeg" });

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add images to the Excel worksheet
    for (let i = 0; i < images.length; i++) {
      const imageBuffer = fs.readFileSync(images[i]);
      worksheet.addImage(imageBuffer, `A${i + 1}`);
    }

    // Save the Excel file
    await workbook.xlsx.writeFile(outputPath);

    console.log("PDF to Excel conversion successful.");
  } catch (error) {
    console.error("Error converting PDF to Excel:", error.message);
  }
}

// Function to convert Excel to PDF
async function convertExcelToPDF(inputPath, outputPath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputPath);

    // Create a PDF document
    const pdfDoc = await PDFLib.PDFDocument.create();
    const pdfPages = await pdfDoc.embedPdf(await workbook.xlsx.writeBuffer());

    // Create a new PDF with the embedded Excel content
    const pdfBytes = await PDFLib.PDFDocument.create();
    const [page] = await pdfBytes.addPage([pdfPages.width, pdfPages.height]);
    page.drawImage(pdfPages, {
      x: 0,
      y: 0,
      width: pdfPages.width,
      height: pdfPages.height,
    });

    // Save the PDF file
    fs.writeFileSync(outputPath, await pdfBytes.save());

    console.log("Excel to PDF conversion successful.");
  } catch (error) {
    console.error("Error converting Excel to PDF:", error.message);
  }
}

module.exports = {
  convertPDFToWord,
  convertWordToPDF,
  convertPDFToPPT,
  convertPPTToPDF,
  convertExcelToPDF,
  convertPDFToExcel,
};
