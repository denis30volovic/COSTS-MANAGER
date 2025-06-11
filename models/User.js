/**
 * @fileoverview User model schema definition with computed pattern for total costs
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} User
 * @property {Number} id - Unique identifier for the user
 * @property {String} first_name - User's first name
 * @property {String} last_name - User's last name
 * @property {String} birthday - User's birthday
 * @property {String} marital_status - User's marital status
 * @property {Number} total_costs - Computed total of all costs for the user
 */

/**
 * @type {mongoose.Schema}
 * @description Schema for the User model with computed total_costs field
 */
const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    marital_status: {
        type: String,
        required: true
    },
    total_costs: {
        type: Number,
        default: 0
    }
});

/**
 * @description Updates the total_costs field for a user by aggregating all their costs
 * @param {Number} userId - The ID of the user to update
 * @returns {Promise<void>}
 * @throws {Error} If the update operation fails
 */
userSchema.statics.updateTotalCosts = async function (userId) {
    const Cost = mongoose.model('Cost');
    const total = await Cost.aggregate([
        { $match: { userid: userId } },
        { $group: { _id: null, total: { $sum: '$sum' } } }
    ]);

    await this.findOneAndUpdate(
        { id: userId },
        { total_costs: total[0]?.total || 0 }
    );
};

module.exports = mongoose.model('User', userSchema); 