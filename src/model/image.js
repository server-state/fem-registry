const {Model} = require('sequelize');
const beautify = require('prettier');

module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
    }

    Image.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
    }, {
        modelName: 'Image',
        sequelize
    })

    Image.associate = (models) => {
        models.Image.belongsTo(models.Release, {
            // as: 'status_by',
            onDelete: 'SET NULL',
            foreignKey: {
                allowNull: false,
            }
        })
    }

    return Image;
};
