const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Pet {

  static getOwner(id) {
    return database('pets')
      .join('owners', {'pets.owner_id', 'owner.id'})
      .where('owners.id', id)
      .first()
  }

  static getPet(id){
    return database('pets')
      .where('id', id)
      .first()
  }

  static getAllPets() {
    return database('pets')
      .select()
  }
}
