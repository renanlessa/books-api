import bcrypt from 'bcrypt';

export default (sequelize, DataType) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.set('password', bcrypt.hashSync(user.password, salt));
      }
    },
    // classMethods: {
    //   isPassword: (encodedPassword, password) => {
    //     console.log('aquii');
    //     return true; //bcrypt.compareSync(password, encodedPassword),
    //   }
    // }
  });

  // Users.isFuncao = (encodedPassword, password) => {
  //   return true;
  //   //bcypt.compareSync(password, encodedPassword);
  // };

  // Users.novaFuncao = function(password) {
  //   return true;
  // };
  
  Users.isPassword = bcrypt.compare;

  return Users;
}