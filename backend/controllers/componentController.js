const Component = require('../models/Component');

exports.getComponents = async (req, res) => {
  try {
    const components = await Component.find();
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
  try {
    const newComponent = new Component({
      name,
      use,
      technologies,
      tags,
    });

    const component = await newComponent.save();
    res.json(component);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateComponent = async (req, res) => {
  const { name, use, technologies, tags } = req.body;
  try {
    let component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ msg: 'Component not found' });

    component.name = name || component.name;
    component.use = use || component.use;
    component.technologies = technologies || component.technologies;
    component.tags = tags || component.tags;

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
