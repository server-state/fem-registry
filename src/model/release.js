const {Model} = require('sequelize');
const beautify = require('prettier');

module.exports = (sequelize, DataTypes) => {
    class Release extends Model {
        isApproved() {
            return this.status === Release.APPROVED;
        }

        async approve(maintainerID) {
            this.status_by = maintainerID;
            this.status_at = Date.now();
            this.status = Release.APPROVED;

            await this.save();
        }

        async reject(maintainerID) {
            this.status_by = maintainerID;
            this.status_at = Date.now();
            this.status = Release.REJECTED;

            await this.save();
        }

        get prettyCode() {
            return beautify.format(this.code, {
                singleQuote: true,
            });
        }
    }

    Release.PENDING = 0;
    Release.APPROVED = 1;
    Release.REJECTED = 2;

    Release.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        version: {type: DataTypes.STRING, allowNull: false},
        code: {type: DataTypes.TEXT, allowNull: false},
        description: {type: DataTypes.TEXT, defaultValue: ''},
        release_notes: {type: DataTypes.TEXT, defaultValue: ''},
        support_url: {type: DataTypes.STRING(500), allowNull: false},
        website: {type: DataTypes.STRING(500), allowNull: true},
        repo_url: {type: DataTypes.STRING(500), allowNull: true},

        status: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        status_at: {type: DataTypes.INTEGER, defaultValue: null}
    }, {
        modelName: 'Release',
        sequelize
    })

    Release.associate = (models) => {
        models.Release.belongsTo(models.Maintainer, {
            // as: 'status_by',
            onDelete: 'SET NULL',
            foreignKey: {
                name: 'status_by',
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
        models.Release.hasMany(models.Image)
    }

    return Release;
};
