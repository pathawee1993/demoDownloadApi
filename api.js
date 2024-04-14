const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

// Replace this with your actual PDF directory path
const pdfDirectory = "./pdfs";

// Error handling class
class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

// Middleware for error handling
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/download-pdf", (req, res) => {
  const filePath = `${pdfDirectory}/dummy.pdf`;

  if (!fs.existsSync(filePath)) {
    const notFoundError = new CustomError(404, "PDF file not found");
    return next(notFoundError);
  }

  res.download(filePath, `dummy.pdf`, (err) => {
    if (err) {
      const downloadError = new CustomError(
        500,
        "Error: Unable to download the PDF file"
      );
      return next(downloadError);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
