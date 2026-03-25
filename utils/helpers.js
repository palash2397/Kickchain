export const setUploadPath = (folder) => {
  return (req, res, next) => {
    req.folderType = folder;
    next();
  };
};