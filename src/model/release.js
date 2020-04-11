module.exports = (sequelize, DataTypes) => {
    const Release = sequelize.define('Release', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {type: DataTypes.STRING, allowNull: false},
        version: {type: DataTypes.STRING, allowNull: false},
        code: {type: DataTypes.TEXT, allowNull: false},
        description: {type: DataTypes.TEXT, defaultValue: ''},
        release_notes: {type: DataTypes.TEXT, defaultValue: ''},
        support_url: {type: DataTypes.STRING(500), allowNull: false},
        website: {type: DataTypes.STRING(500), allowNull: true},
        repo_url: {type: DataTypes.STRING(500), allowNull: true},

        status: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        status_at: {type: DataTypes.INTEGER, defaultValue: null}
    })

    Release.associate = (models) => {
        models.Release.belongsTo(models.Maintainer, {
            as: 'status_by',
            onDelete: 'SET NULL',
            foreignKey: {
                allowNull: true,
                defaultValue: null
            }
        })
        models.Release.belongsTo(models.CBM, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    }

    return Release;
};
