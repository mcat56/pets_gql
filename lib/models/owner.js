const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Owner {

  static getOwnerPets(id){
    return database('owners')
      .join('pets', {'pets.owner_id': 'owners.id'})
      .where('pets.owner_id', id)
  }

  static getOwner(id) {
    return database('owners')
      .where('id', id)
      .first()
  }

  static getAllOwners() {
    return database('owners')
      .select()
  }
}

module.exports = Owner;
