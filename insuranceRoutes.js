const express = require('express');
const router = express.Router();
const Insurance = require('../models/Insurance');

router.post('/', async (req, res) => {
  const insurance = new Insurance(req.body);
  await insurance.save();
  res.send(insurance);
});

router.get('/', async (req, res) => {
  const insurances = await Insurance.find();
  res.send(insurances);
});

router.get('/:id', async (req, res) => {
  const insurance = await Insurance.findById(req.params.id);
  res.send(insurance);
});

router.put('/:id', async (req, res) => {
  const insurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(insurance);
});

router.delete('/:id', async (req, res) => {
  await Insurance.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted successfully' });
});

module.exports = router;
