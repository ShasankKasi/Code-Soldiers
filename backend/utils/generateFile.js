const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");
const dirTestcases = path.join(__dirname, "testcases");
const outputPath = path.join(__dirname, "outputs");

function cleanDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Call cleanup before generating files

const generateFile = async (language, code, input) => {
  let fileName;
  cleanDirectory(dirCodes);
cleanDirectory(dirTestcases);
cleanDirectory(outputPath);

  if (language === "java") {
    // Extract public class name
    const match = code.match(/public\s+class\s+(\w+)/);
    const className = match ? match[1] : "Main";
    fileName = `${className}.java`;
  } else {
    fileName = `${uuid()}.${language}`;
  }

  const fileName2 = `${uuid()}.txt`;
  const filePath = path.join(dirCodes, fileName);
  const filePath2 = path.join(dirTestcases, fileName2);

  fs.writeFileSync(filePath, code);
  fs.writeFileSync(filePath2, input);

  return { filePath, filePath2 };
};

module.exports = { generateFile };
