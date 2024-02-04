const router = require('express').Router();
const Accounts = require('./accounts-model');
const { checkAccountPayload, checkAccountId, checkAccountNameUnique } = require('./accounts-middleware');

router.get('/', async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', checkAccountId, async (req, res, next) => {

  res.json(req.account);
});

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const newAccount = await Accounts.create(req.body);
    res.status(201).json(newAccount);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', checkAccountId, checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const updatedAccount = await Accounts.updateById(req.params.id, req.body);
    res.json(updatedAccount);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    await Accounts.deleteById(req.params.id);
   
    res.json(req.account);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message
  });
});

module.exports = router;
