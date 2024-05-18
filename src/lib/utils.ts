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

export function extractImageUrls(node: ANY): { url: string; alt: string }[] {
  if (!node.children) return [];

  return node.children.flatMap((child: ANY) => {
    if (child.type === 'img' && child.url) {
      return [{ url: child.url, alt: child.alt || '' }];
    }
    return extractImageUrls(child);
  });
}
