export const generateRandomId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c) => ((Math.random() * 16) | 0).toString(16) + (c === 'y' ? 8 : 0).toString(16),
  );
