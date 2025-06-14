/**
 * @fileoverview Cost model schema definition with hooks for computed pattern
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Cost
 * @property {String} description - Description of the cost item
 * @property {String} category - Category of the cost (food, health, housing, sport, education)
 * @property {Number} userid - ID of the user who owns this cost
 * @property {Number} sum - Amount of the cost
 * @property {Date} date - Date when the cost was created
 */

/**
 * @type {mongoose.Schema}
 * @description Schema for the Cost model with hooks for updating user's total_costs
 */
const costSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sport', 'education']
    },
    userid: {
        type: Number,
        required: true
    },
    sum: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

/**
 * @description Post-save hook to update the user's total_costs after saving a new cost
 * @function
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If the update operation fails
 */
costSchema.post('save', async function () {
    const User = mongoose.model('User');
    await User.updateTotalCosts(this.userid);
});

/**
 * @description Post-remove hook to update the user's total_costs after removing a cost
 * @function
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If the update operation fails
 */
costSchema.post('remove', async function () {
    const User = mongoose.model('User');
    await User.updateTotalCosts(this.userid);
});

module.exports = mongoose.model('Cost', costSchema); 