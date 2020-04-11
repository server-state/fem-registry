module.exports = (sequelize, DataTypes) => {
    const PendingEmailConfirmations = sequelize.define('PendingEmailConfirmations', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
    });

    PendingEmailConfirmations.associate = (models) => {
        models.PendingEmailConfirmations.belongsTo(models.Publisher, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        })
    }

    return PendingEmailConfirmations;
};
