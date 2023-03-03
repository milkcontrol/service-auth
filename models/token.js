const {Model} = require('objection');

class Token extends Model {
    static get tableName() {
        return 'tokens';
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
            required: ['uid', 'userId','isRevoked',],
            properties: {
                uid: {type: 'string', maxLength: 255},
                userId: {type: 'string', maxLength: 255},
                isRevoked: {type: 'integer'},
                createdAt: {type: 'number'},
                updatedAt: {type: 'number'},
            }
        };
    }
}

module.exports = Token;