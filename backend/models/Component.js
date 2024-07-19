const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  use: {
    type: String,
    required: true,
  },
  technologies: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  codeSnippets: [
    {
      language: { type: String, required: true },
      code: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Component', ComponentSchema);
