const {Model} = require('sequelize');
const beautify = require('prettier');
const fs = require('fs');

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

        get logoUrl() {
            const folder = require('path').join(__dirname, '../../image-store', this.CBMId, this.id.toString());
            // const folder = require('path').join(__dirname, '../../image-store', 'cbmId', 'releaseId');

            if (fs.existsSync(folder)) {
                let filename = (fs.readdirSync(folder).filter(f => f.startsWith('logo'))[0]);
                return `/images/${this.CBMId}/${this.id}/${filename}`
            } else {
                return null
            }
        }

        get imageUrls() {
            const folder = require('path').join(__dirname, '../../image-store', this.CBMId, this.id.toString(), 'screenshots');

            if (fs.existsSync(folder)) {
                return fs.readdirSync(folder).filter(v => {
                    return v.endsWith('.png') || v.endsWith('.svg') || v.endsWith('.jpg')
                }).map(v => `/images/${this.CBMId}/${this.id}/screenshots/${v}`);
            } else {
                return [];
            }
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
    }

    return Release;
};
