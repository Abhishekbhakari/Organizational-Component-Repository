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
  ratings: { 
    type: [Number],
    default: [] 
  },
  comments: [{
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  image: {
    type: String, // Store the image URL as a string
  },
});

module.exports = mongoose.model('Component', ComponentSchema);
