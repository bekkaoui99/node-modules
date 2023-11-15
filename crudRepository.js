const mongoose = require("mongoose");

function createRepositoryForEntity(entityName, schemaDefinition) {
  const entitySchema = new mongoose.Schema(schemaDefinition);
  const Entity = mongoose.model(entityName, entitySchema);

  function create(entity) {
    return Entity.create(entity);
  }

  function findById(id) {
    return Entity.findById(id);
  }

  function update(id, entity) {
    return Entity.findByIdAndUpdate(id, entity, { new: true });
  }

  function remove(id) {
    return Entity.findByIdAndRemove(id);
  }

  function findAll() {
    return Entity.find();
  }

  function count() {
    return Entity.countDocuments();
  }

  return {
    create,
    findById,
    update,
    remove,
    findAll,
    count,
  };
}

module.exports = createRepositoryForEntity;
