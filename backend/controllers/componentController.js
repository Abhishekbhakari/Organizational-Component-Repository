const Component = require('../models/Component');

exports.getComponentsDashboard = async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getComponents = async (req, res) => {
  const searchTerm = req.query.search;

  try {
    let components;
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i'); 
      components = await Component.find({
        $or: [
          { name: searchRegex },
          { use: searchRegex },
          { technologies: searchRegex },
          { tags: searchRegex },
        ],
      });
    } else {
      components = await Component.find();
    }
    res.json(components);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

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

    // Log the component data before saving
    console.log("Saving new component:", newComponent); 

    const component = await newComponent.save();
    res.json(component);
  } catch (err) {
    console.error('Error creating component:', err); // Log the error
    res.status(500).json({ msg: 'Server error' }); 
  }
};

exports.updateComponent = async (req, res) => {
  const { name, use, technologies, tags , codeSnippets } = req.body;
  try {
    let component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ msg: 'Component not found' });

    component.name = name || component.name;
    component.use = use || component.use;
    component.technologies = technologies || component.technologies;
    component.tags = tags || component.tags;
    component.tags = codeSnippets || component.codeSnippets;

    component = await component.save();
    res.json(component);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ msg: 'Component not found' });

    await component.remove();
    res.json({ msg: 'Component removed' });
  } catch (err) {
    res.status({ msg: 'Server error' });
  }
};
