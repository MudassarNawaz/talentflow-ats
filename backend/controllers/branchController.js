const Branch = require('../models/Branch');

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find({ isActive: true }).sort('name');
    res.json({ success: true, count: branches.length, branches });
  } catch (error) { next(error); }
};

exports.getBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
    res.json({ success: true, branch });
  } catch (error) { next(error); }
};

exports.createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, branch });
  } catch (error) { next(error); }
};

exports.updateBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
    res.json({ success: true, branch });
  } catch (error) { next(error); }
};

exports.deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
    res.json({ success: true, message: 'Branch deactivated' });
  } catch (error) { next(error); }
};
