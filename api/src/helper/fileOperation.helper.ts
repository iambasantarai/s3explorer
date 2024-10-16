import fs from "node:fs";

const removeFile = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) {
        console.error(error);
        reject(false);
      }

      console.log("Removed file: ", path);
      resolve(true);
    });
  });
};

export default {
  removeFile,
};
