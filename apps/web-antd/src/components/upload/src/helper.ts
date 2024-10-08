export function checkFileType(file: File, accepts: string[]) {
  console.log(file.name, accepts);
  let reg;
  if (!accepts || accepts.length === 0) {
    reg = /.(?:jpg|jpeg|png|gif|webp)$/i;
  } else {
    const newTypes = accepts.join('|');
    reg = new RegExp(`${String.raw`\.(` + newTypes})$`, 'i');
  }
  return reg.test(file.name);
}

export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

export function isImgTypeByName(name: string) {
  return /\.(?:jpg|jpeg|png|gif|webp)$/i.test(name);
}

export function getBase64WithFile(file: File) {
  return new Promise<{
    file: File;
    result: string;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () =>
      resolve({ result: reader.result as string, file }),
    );
    reader.addEventListener('error', (error) => reject(error));
  });
}
