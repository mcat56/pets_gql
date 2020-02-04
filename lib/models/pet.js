const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Pet {

  static getOwner(id) {
    return database('pets')
      .join('owners', {'pets.owner_id': 'owner.id'})
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

  static addPet(pet_info) {
    return database('pets')
      .insert({
        name: pet_info.name, age: pet_info.age, breed: pet_info.breed, animal_type: pet_info.animal_type,
        favorite_treat: pet_info.favorite_treat, owner_id: pet_info.owner_id
      }).returning('*')
  }

  static deletePet(id) {
    return database('pets')
      .where('id', id)
      .del()
  }
}

module.exports = Pet;
