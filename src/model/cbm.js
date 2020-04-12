const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CBM extends Model {
        async getLatestApprovedRelease() {
            const releases = await this.getReleases({
                where: {
                    status: 1
                },
                order: ['id']
            });

            return releases[0] || null;
        }
    }

    CBM.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {sequelize, modelName: 'CBM'})

    CBM.associate = (models) => {
        models.CBM.belongsTo(models.Publisher, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });

        models.CBM.hasMany(models.Release)
    }

    return CBM;
};
