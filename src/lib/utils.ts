export const generateRandomId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c) => ((Math.random() * 16) | 0).toString(16) + (c === 'y' ? 8 : 0).toString(16),
  );

export const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export function extractImageUrls(body: string): { src: string; alt: string }[] {
  const imageRegex = /\[(.*?)\]\((.*?\.(?:jpg|png))\)/g;
  const matches = body.match(imageRegex) || [];
  return matches.map((match) => {
    const [_, alt, src] = match.match(/\[(.*?)\]\((.*?\.(?:jpg|png))\)/) || [];
    return { alt, src };
  });
}
