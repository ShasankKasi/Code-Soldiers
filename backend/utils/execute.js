const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

// Ensure outputs directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

function cleanCompilerError(stderr) {
  return stderr
    .replace(/([A-Z]:)?[\/\\][\w\s.\-\/\\]+?\.(cpp|c|h|hpp)/gi, "Main.cpp")
    .replace(/([A-Z]:)?[\/\\][\w\s.\-\/\\]+?\.py/gi, "Main.py")
    .replace(/([A-Z]:)?[\/\\][\w\s.\-\/\\]+?\.java/gi, "Main.java")
    .replace(/\b\w*Main\.(cpp|py|java)/gi, (m, ext) => `Main.${ext}`)
    .replace(/^\s*[\r\n]/gm, "")
    .trim();
}

const execute = (filePath, filePath2, language) => {
  if (language === "py") {
    // Run Python code with python3
    return new Promise((resolve, reject) => {
      exec(`python3 "${filePath}" < "${filePath2}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject({ error: cleanCompilerError(stderr || error.message) });
        }
        resolve(stdout.trim());
      });
    });
  } else if (language === "java") {
    // Compile and run Java code
    return new Promise((resolve, reject) => {
      const dir = path.dirname(filePath);
      const className = path.basename(filePath, ".java");

      exec(`javac "${filePath}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject({ error: cleanCompilerError(stderr || error.message) });
        }

        exec(`java -cp "${dir}" ${className} < "${filePath2}"`, (error, stdout, stderr) => {
          if (error || stderr) {
            return reject({ error: cleanCompilerError(stderr || error.message) });
          }
          resolve(stdout.trim());
        });
      });
    });
  } else if (language === "cpp" || language === "c") {
    // Compile and run C/C++ code
    const jobID = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, jobID);

    return new Promise((resolve, reject) => {
      exec(`g++ "${filePath}" -o "${outPath}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject({ error: cleanCompilerError(stderr || error.message) });
        }

        exec(`"${outPath}" < "${filePath2}"`, (error, stdout, stderr) => {
          if (error || stderr) {
            return reject({ error: cleanCompilerError(stderr || error.message) });
          }
          resolve(stdout.trim());
        });
      });
    });
  } else {
    return Promise.reject({ error: "Unsupported language" });
  }
};

module.exports = { execute };
