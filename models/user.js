const {Model} = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }
    static get idColumn() {
        return 'uid';
    }
    $beforeInsert() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['uid', 'username','password',],
            properties: {
                uid: {type: 'string', maxLength: 255},
                username: {type: 'string', maxLength: 255},
                password: {type: 'string', maxLength: 255},
                role:{type: 'number'},
                createdAt: {type: 'number'},
                updatedAt: {type: 'number'}
            }
        };
    }
}

module.exports = User;