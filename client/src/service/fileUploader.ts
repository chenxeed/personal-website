interface Option {
  accept?: string;
}

/**
 * Upload a file without the need of a form
 */
export function fileUploader(option: Option = {}): Promise<FileList | null> {
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");

  if (option.accept) {
    fileInput.setAttribute("accept", option.accept);
  }

  const promise = new Promise<FileList | null>((res) => {
    fileInput.addEventListener("change", (e) => {
      if (!e?.target) {
        throw new Error("File Upload library failed");
      }
      const fileInput = e.target as HTMLInputElement;

      fileInput.remove();
      res(fileInput.files);
    });
  });
  fileInput.click();

  return promise;
}
