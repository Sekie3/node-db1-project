const Accounts = require('./accounts-model');
const db = require('../../data/db-Config');

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;
  
  if (name === undefined || budget === undefined) {
    return res.status(400).json({ message: "name and budget are required" });
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return res.status(400).json({ message: "name of account must be between 3 and 100" });
  }

  const budgetNumber = Number(budget);
  if (!Number(budget)) {
    return res.status(400).json({ message: "budget of account must be a number" });
  }  

  if (budget < 0 || budget > 1000000) {
    return res.status(400).json({ message: "budget of account is too large or too small" });
  }

  req.body.name = trimmedName;
  req.body.budget = budgetNumber;
  next();
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const { name } = req.body;
    const trimmedName = name.trim();
    const existingAccount = await db('accounts').whereRaw('LOWER(name) = ?', trimmedName.toLowerCase()).first();
    if (existingAccount) {
      return res.status(400).json({ message: "that name is taken" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkAccountId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Accounts.getById(id);
    if (!account) {
      return res.status(404).json({ message: "account not found" });
    }
   
    req.account = account;
    next();
  } catch (error) {
    next(error);
  }
};
