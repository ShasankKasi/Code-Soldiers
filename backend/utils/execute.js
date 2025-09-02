const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

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
    return new Promise((resolve, reject) => {
      exec(`python "${filePath}" < "${filePath2}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject({ error: cleanCompilerError(stderr || error.message) });
        }
        resolve(stdout.trim());
      });
    });
  } else if (language === "java") {
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
  } else {
    const jobID = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, `${jobID}.exe`);

    return new Promise((resolve, reject) => {
      exec(
        `cmd /c g++ "${filePath}" -o "${outPath}" && cd "${outputPath}" && "${jobID}.exe" < "${filePath2}"`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            return reject({ error: cleanCompilerError(stderr || error.message) });
          }
          resolve(stdout.trim());
        }
      );
    });
  }
};

module.exports = { execute };
