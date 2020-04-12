const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PendingEmailConfirmations extends Model {
        isExpired(minutesTillExpiry) {
            return (Date.now() - 1000*60*minutesTillExpiry > Date.parse(this.createdAt));
        }
    }

    PendingEmailConfirmations.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'PendingEmailConfirmations'
    })

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
