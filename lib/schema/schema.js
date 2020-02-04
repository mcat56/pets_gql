const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const Owner = require('../models/owner')
const Pet = require('../models/pet')

const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;


const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args){
        return Owner.getOwnerPets(parent.id)
      }
    }
  })
});

const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: () => ({
     id: {type: GraphQLID},
     name: {type: GraphQLString},
     animal_type: {type: GraphQLString},
     breed: {type: GraphQLString},
     age: {type: GraphQLInt},
     favorite_treat: {type: GraphQLString},
     owner: {
       type: OwnerType,
       resolve(parent, args){
         return Pet.getOwner(parent.owner_id)
       }
     }
   })
 });


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:{
    pet: {
      type: PetType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Pet.getPet(args.id)
      }
    },
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args){
        return Pet.getAllPets()
      }
    },
    owners: {
      type: new GraphQLList(OwnerType),
      resolve(parent, args){
        return Owner.getAllOwners()
      }
    },
    owner: {
      type: OwnerType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Owner.getOwner(args.id)
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addOwner: {
      type: OwnerType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args) {
        return Owner.addOwner(args.name, args.age)
        .then(result => result[0])
        .catch(error => error)
      }
    },
    addPet: {
      type: PetType,
      args: {
        name: {type: GraphQLString},
        animal_type: {type: GraphQLString},
        breed: {type: GraphQLString},
        age: {type: GraphQLInt},
        favorite_treat: {type: GraphQLString}
      },
      resolve(parent, args) {
        return Pet.addPet(args)
        .then(result => result[0])
        .catch(error => error)
      }
    },
    deleteOwner: {
      type: GraphQLString,
      args: {id: {type: GraphQLNonNull(GraphQLID)}},
      resolve(parent, args){
        return Owner.deleteOwner(args.id)
        .then((result) => {
          if(result == 1){
            return "Success!"
          } else {
            return "Something went wrong, please check the id and try again."
          }
        })
        .catch(error => error)
      }
    },
    deletePet: {
      type: GraphQLString,
      args: {id: {type: GraphQLNonNull(GraphQLID)}},
      resolve(parent, args) {
        return Pet.deletePet(args.id)
        .then((result) => {
          if (result == 1) {
            return 'Success!'
          } else {
            return 'Something went wrong, please check the id and try again.'
          }
        })
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
