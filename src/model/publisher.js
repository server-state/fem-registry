module.exports = (sequelize, DataTypes) => {
    const Publisher = sequelize.define('Publisher', {
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
    })

    Publisher.associate = (models) => {
        models.Publisher.hasMany(models.CBM);
    }

    return Publisher;
};
