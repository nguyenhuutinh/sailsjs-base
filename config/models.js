module.exports.models = {
  attributes: {
    createdAt: {
      autoCreatedAt: true,
      type: 'number'
    },
    id: {
      autoIncrement: true,
      type: 'number'
    },
    updatedAt: {
      autoUpdatedAt: true,
      type: 'number'
    }
  },
  cascadeOnDestroy: true,
  dataEncryptionKeys: {
    // TODO: Change this!
    default: 'SI10NuNCsVt911AAgNUy//tYHWYlo5c5g5zIFOWxBls='
  },
  migrate: 'alter',
  schema: true
};
