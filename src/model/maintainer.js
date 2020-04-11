const {Model} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Maintainer extends Model {
        async setPassword(password) {
            this.password = await bcrypt.hash(password, 8);
            this.save();
        }
    }

    Maintainer.init({
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
    }, {sequelize, modelName: 'Maintainer'});

    Maintainer.authenticate = async (email, password, done) => {
        try {
            const maintainer = await Maintainer.findOne({where: {email}});

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

    Maintainer.associate = (models) => {
        models.Maintainer.hasMany(models.Release, {
            foreignKey: {
                name: 'status_by',
                allowNull: true,
                defaultValue: null
            }
        });
    }

    return Maintainer;
};
