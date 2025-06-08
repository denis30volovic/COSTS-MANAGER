/**
 * @fileoverview Router for handling user-related API endpoints
 * @requires express
 * @requires ../models/User
 * @requires ../models/Cost
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cost = require('../models/Cost');

/**
 * @route GET /api/about
 * @description Get team members details
 * @returns {Object} JSON object containing team members information
 */
router.get('/about', (req, res) => {
    try {
        // This should be replaced with actual team members' information
        const teamMembers = [
            {
                first_name: "Denis",
                last_name: "Volovik"
            },
            {
                first_name: "Lior",
                last_name: "Barel"
            }
        ];
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/users/:id
 * @description Get details of a specific user
 * @param {string} id - User ID
 * @returns {Object} JSON object containing user details including first_name, last_name, id, and total costs
 */
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total: user.total_costs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/report
 * @description Get monthly report for a specific user
 * @query {number} id - User ID
 * @query {number} year - Year for the report
 * @query {number} month - Month for the report
 * @returns {Object} JSON object containing costs grouped by categories for the specified month
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        if (!id || !year || !month) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Check if user exists
        const user = await User.findOne({ id: id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create date range for the specified month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Get all costs for the user in the specified month
        const costs = await Cost.find({
            userid: id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Group costs by category
        const categories = ['food', 'health', 'housing', 'sport', 'education'];
        const report = {
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month),
            costs: categories.map(category => {
                const categoryCosts = costs
                    .filter(cost => cost.category === category)
                    .map(cost => ({
                        sum: cost.sum,
                        description: cost.description,
                        day: new Date(cost.date).getDate()
                    }));
                return { [category]: categoryCosts };
            })
        };

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/add
 * @description Add a new cost item
 * @body {Object} costItem - Cost item details
 * @body {string} costItem.description - Description of the cost
 * @body {string} costItem.category - Category of the cost (food, health, housing, sport, education)
 * @body {number} costItem.userid - User ID
 * @body {number} costItem.sum - Cost amount
 * @returns {Object} JSON object containing the newly created cost item
 */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum } = req.body;

        // Validate required fields
        if (!description || !category || !userid || !sum) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate category
        const validCategories = ['food', 'health', 'housing', 'sport', 'education'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        // Check if user exists
        const user = await User.findOne({ id: userid });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create new cost item
        const cost = new Cost({
            description,
            category,
            userid,
            sum,
            date: new Date()
        });

        await cost.save();
        res.status(201).json(cost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PUT /api/users/:id
 * @description Update user details
 * @param {string} id - User ID
 * @body {Object} userData - Updated user data
 * @returns {Object} JSON object containing updated user details
 */
router.put('/users/:id', async (req, res) => {
    try {
        const { first_name, last_name, birthday, marital_status } = req.body;
        const user = await User.findOne({ id: req.params.id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update only provided fields
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (birthday) user.birthday = birthday;
        if (marital_status) user.marital_status = marital_status;

        await user.save();

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: user.birthday,
            marital_status: user.marital_status,
            total: user.total_costs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/users
 * @description Create a new user
 * @body {Object} userData - User data
 * @body {number} userData.id - Unique identifier for the user
 * @body {string} userData.first_name - User's first name
 * @body {string} userData.last_name - User's last name
 * @body {string} userData.birthday - User's birthday
 * @body {string} userData.marital_status - User's marital status
 * @returns {Object} JSON object containing the newly created user
 */
router.post('/users', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday, marital_status } = req.body;

        // Validate required fields
        if (!id || !first_name || !last_name || !birthday || !marital_status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user with this ID already exists
        const existingUser = await User.findOne({ id });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this ID already exists' });
        }

        // Create new user
        const user = new User({
            id,
            first_name,
            last_name,
            birthday,
            marital_status
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 