export const setUploadPath = (folder) => {
  return (req, res, next) => {
    req.folderType = folder;
    next();
  };
};

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getExpirationTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // Current time + 5 minutes
};