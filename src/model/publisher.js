const {Model} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Publisher extends Model {
        async setPassword(password) {
            this.password = await bcrypt.hash(password, 8);
            this.save();
        }

        async verifyPassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }

    Publisher.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.CHAR,
            allowNull: false
        },
        email: {
            type: DataTypes.CHAR,
            unique: true,
            allowNull: true
        },
        password: {
            type: DataTypes.CHAR,
            allowNull: false
        }
    }, {sequelize, modelName: 'Publisher'})

    Publisher.authenticate = async (email, password, done) => {
        try {
            const maintainer = await Publisher.findOne({where: {email}});

            const isMatch = await bcrypt.compare(password, maintainer.password);


            if (isMatch) {
                return done(null, maintainer);
            } else {
                return done(null, false);
            }
        } catch (e) {
            return done(null, false);
        }
    }

    Publisher.isEmailUsed = async (email) => {
        return (await Publisher.count({where: {email}})) > 0
    }

    Publisher.associate = (models) => {
        models.Publisher.hasMany(models.FEM);
    }

    return Publisher;
};
