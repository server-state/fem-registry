module.exports = (sequelize, DataTypes) => {
    const CBM = sequelize.define('CBM', {
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
    })

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
