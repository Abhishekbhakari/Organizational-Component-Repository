const Component = require('../models/Component');

//Display components on dashboard
exports.getComponentsDashboard = async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

//Display components on Search Page
exports.getComponents = async (req, res) => {
  try {
    const searchTerm = req.query.name || ''; // Get the search term from the query
    const technologies = req.query.technologies ? req.query.technologies.split(',') : [];
    const tags = req.query.tags ? req.query.tags.split(',') : [];
    const rating = req.query.rating ? parseFloat(req.query.rating) : null;
    let query = Component.find(); // Start building the query
    if (searchTerm) {
      query = query.where('name').regex(new RegExp(searchTerm, 'i')); // Add the search term to the query
    }
    if (technologies.length > 0) {
      query = query.where('technologies').in(technologies);
    }
    if (tags.length > 0) {
      query = query.where('tags').in(tags);
    }
    // If rating is not null, filter by rating
    if (rating !== null) { 
      query = query.where('ratings').elemMatch({ $gte: rating }); 
    }
    const components = await query.exec(); // Execute the query
    res.json(components);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

//Compontent Details Page
exports.getComponentById = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ msg: 'Component not found' });
    res.json(component);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createComponent = async (req, res) => {
  const { name, use, technologies, tags } = req.body;
  const codeSnippets = JSON.parse(req.body.codeSnippets);
  console.log("req.file:", req.file); 
  const imageURL = req.file ? req.file.path : null; 

  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image uploaded' }); 
    }

    const newComponent = new Component({
      name, 
      use, 
      technologies, 
      tags, 
      codeSnippets, 
      image: imageURL, 
    });

    console.log("Saving new component:", newComponent); 

    const component = await newComponent.save();
    res.json(component);
  } catch (err) {
    console.error('Error creating component:', err); 
    res.status(500).json({ msg: 'Server error' }); 
  }
};

exports.updateComponent =async (req, res) => {
  try {
    const componentId = req.params.id;
    const updatedData = req.body;
    console.log("Received update data:", updatedData); 
    // Update the component in  database and get updated document
    const component = await Component.findByIdAndUpdate(componentId, updatedData, { new: true }); 

    console.log("Updated component in database:", component);

    if (!component) {
      return res.status(404).json({ msg: 'Component not found' });
    }
    res.json(component); // Send the updated component
  } catch (err) {
    console.error('Error updating component:', err);
    res.status(500).send('Server error');
  }
};

exports.deleteComponent =  async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) {
      return res.status(404).json({ msg: 'Component not found' });
    }
    res.json({ msg: 'Component removed' });
  } catch (err) {
    console.error('Error deleting component:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const componentId = req.params.id;
    const newComment = req.body.text;
    const component = await Component.findByIdAndUpdate(componentId, {
      $push: { comments: { text: newComment, createdAt: Date.now() } }
    }, { new: true });
    if (!component) {
      return res.status(404).json({ msg: 'Component not found' });
    }
    res.json(component); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
