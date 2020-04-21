const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FEM extends Model {
        async getLatestApprovedRelease() {
            const releases = await this.getReleases({
                where: {
                    status: 1
                },
                order: [['id', 'DESC']]
            });

            return releases[0] || null;
        }
    }

    FEM.init({
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
    }, {sequelize, modelName: 'FEM'})

    FEM.associate = (models) => {
        models.FEM.belongsTo(models.Publisher, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });

        models.FEM.hasMany(models.Release)
    }

    return FEM;
};
