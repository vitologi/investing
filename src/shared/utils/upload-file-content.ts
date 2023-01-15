export async function uploadFile(): Promise<string> {
  const uploadElement = document.createElement('input');
  uploadElement.setAttribute('type', 'file');

  const result = new Promise<string>((resolve, reject)=>{
    uploadElement.addEventListener('change', async (_)=>{
      if(!uploadElement.files || !uploadElement.files.length){
        reject();
        return;
      }

      const text = await uploadElement.files[0].text();
      resolve(text);
    });
  });
  uploadElement.click();
  return result;
}
