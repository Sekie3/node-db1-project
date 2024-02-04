const db = require('../../data/db-Config');

const getAll = () => {
  return db('accounts');
};

const getById = (id) => {
  return db('accounts').where({ id }).first();
};

const create = (account) => {
  return db('accounts').insert(account)
    .then(ids => {
      const [id] = ids;
      return getById(id); 
    });
};

const updateById = (id, account) => {
  return db('accounts').where({ id }).update(account)
    .then(count => {
      if (count) {
        return getById(id); 
      }
    
    });
};

const deleteById = (id) => {

  return db('accounts').where({ id }).del();
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
