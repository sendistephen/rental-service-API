const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

exports.transformBufferToBase64 = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);
