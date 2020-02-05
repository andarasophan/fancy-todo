'use strict';
const { hashPass } = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class User extends Model {
    static associate(models) {
      // associations can be defined here
      User.hasMany(models.Todo, {
        foreignKey: 'id'
      })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: 'email should not be empty'
        },
        notEmpty: {
          args: true,
          msg: 'email should not be empty'
        },
        isEmail: {
          args: true,
          msg: 'Invalid email format'
        },
        isDuplicate(value, next) {
          User.findOne({
            where: {
              email: value
            }
          })
            .then(user => {
              if (user) {
                if (this.email == user.email && this.id === user.id) {
                  next()
                } else {
                  next('email is already registered')
                }
              } else {
                next()
              }
            })
            .catch(err => {
              next(err)
            })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4],
          msg: 'Password minimal 4 characters'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = hashPass(user.password);
      }
    },
    sequelize
  })
  return User;
};