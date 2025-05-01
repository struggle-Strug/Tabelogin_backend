const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir); // Directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
  },
});

// Initialize multer for single and multiple uploads
const uploadSingle = multer({ storage: storage }).single("file");
const uploadMultiple = multer({ storage: storage }).array("files", 10); // Accept up to 10 files

module.exports = (db) => {
  return {
    // Controller function for single file upload
    uploadFile: (req, res) => {
      uploadSingle(req, res, (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res
            .status(400)
            .json({ message: "Error uploading file.", error: err.message });
        }
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded." });
        }

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`;
        res
          .status(200)
          .json({ message: "File uploaded successfully!", fileUrl });
      });
    },

    // Controller function for multiple file uploads
    uploadMultipleFiles: (req, res) => {
      uploadMultiple(req, res, (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res
            .status(400)
            .json({ message: "Error uploading files.", error: err.message });
        }
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No files uploaded." });
        }

        const files = req.files.map((file) => {
          return {
            fileUrl: `${req.protocol}://${req.get("host")}/uploads/${
              file.filename
            }`,
            fileName: Buffer.from(file.originalname, "latin1").toString("utf8"),
          };
        });

        res
          .status(200)
          .json({ message: "Files uploaded successfully!", files: files });
      });
    },

    download: (req, res) => {
      try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, "..", "..", "uploads", filename);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
          // Force download by setting the appropriate headers
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
          );
          res.setHeader("Content-Type", "application/octet-stream"); // Adjust MIME type if necessary

          // Stream the file to the response (downloads the file)
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);

          // Handle any errors during streaming
          fileStream.on("error", (err) => {
            console.error("File streaming error:", err);
            res
              .status(500)
              .json({ message: "Error streaming the file", error: true });
          });
        } else {
          console.error("File not found:", filePath);
          res.status(404).json({ message: "File not found" });
        }
      } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },

    // Controller function to delete a file
    deleteFile: (req, res) => {
      const filename = req.params.filename;
      const filePath = path.join(__dirname, "..", "..", "uploads", filename);

      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return res
              .status(500)
              .json({ message: "Error deleting file", error: true });
          }
          res.status(200).json({ message: "File deleted successfully" });
        });
      } else {
        console.error("File not found:", filePath);
        return res.status(404).json({ message: "File not found" });
      }
    },
  };
};
