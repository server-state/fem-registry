module.exports = (sequelize, DataTypes) => {
    const PendingPasswordReset = sequelize.define('PendingPasswordReset', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        }
    });

    PendingPasswordReset.associate = (models) => {
        models.PendingPasswordReset.belongsTo(models.Publisher, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        })
    }

    return PendingPasswordReset;
};
