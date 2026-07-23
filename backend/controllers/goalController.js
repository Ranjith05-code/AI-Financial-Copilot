const Goal = require("../models/Goal");

// Create Goal
const createGoal = async (req, res) => {

    try {

        const { title, targetAmount } = req.body;

        const goal = await Goal.create({

            user: req.user.id,

            title,

            targetAmount,

        });

        res.status(201).json({

            success: true,

            goal,

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

// Get Goal
const getGoal = async (req, res) => {

    try {

        const goal = await Goal.findOne({

            user: req.user.id,

        });

        res.json({

            success: true,

            goal,

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

// Update Saved Amount
const updateGoal = async (req, res) => {

    try {

        const { savedAmount } = req.body;

        const goal = await Goal.findOne({

            user: req.user.id,

        });

        if (!goal) {

            return res.status(404).json({

                success: false,

                message: "Goal not found",

            });

        }

        goal.savedAmount = savedAmount;

        await goal.save();

        res.json({

            success: true,

            goal,

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

module.exports = {

    createGoal,

    getGoal,

    updateGoal,

};