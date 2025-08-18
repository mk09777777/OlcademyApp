const express = require('express');
const router = express.Router();
const moment = require('moment');
const Order = require('../../models/UserOrderTakeaway');
const User = require('../../models/user');
const Tiffin = require('../../models/Tiffin');
const { authenticateToken } = require("../../controller/DashboardToken/JWT");

const getDateRange = (period) => {
    let startDate = null;
    let endDate = null;

    const now = moment();

    switch (period) {
        case 'today':
            startDate = now.startOf('day').toDate();
            endDate = now.endOf('day').toDate();
            break;
        case 'thisWeek':
            startDate = now.startOf('isoWeek').toDate();
            endDate = now.endOf('isoWeek').toDate();
            break;
        case 'thisMonth':
            startDate = now.startOf('month').toDate();
            endDate = now.endOf('month').toDate();
            break;
        case 'allTime':
        default:
            break;
    }
    return { startDate, endDate };
};

const populateOrderItems = (query) => {
    return query
        .populate({
            path: 'items.productId',
            model: 'Firm',
            select: 'name description price img foodType',
            discriminator: {
                'Tiffin': { model: 'Tiffin', select: 'name description price img foodType mealType selectedPlan image_urls' }
            },
            match: { 'productModelType': { $exists: true } }
        })
        .populate({
            path: 'items.sourceEntityId',
            model: 'Firm',
            select: 'name email address image_urls',
            discriminator: {
                'Tiffin': { model: 'Tiffin', select: 'name ownerEmail address image_urls' }
            },
            match: { 'sourceEntityName': { $exists: true } }
        });
};


router.get('/order-summary', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });
        console.log(tiffin);
        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const periods = ['today', 'thisWeek', 'thisMonth', 'allTime'];
        const summary = {};

        for (const period of periods) {
            const { startDate, endDate } = getDateRange(period);
            const matchQuery = { status: { $in: ['accept', 'preparing', 'ready'] } };

            if (startDate && endDate) {
                matchQuery.orderTime = { $gte: startDate, $lte: endDate }; // Changed back to orderTime
            }

            matchQuery['items.sourceEntityId'] = tiffinId;
            matchQuery['items.sourceEntityName'] = 'Tiffin';

            const result = await Order.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ]);

            summary[period] = {
                orders: result.length > 0 ? result[0].totalOrders : 0,
                revenue: result.length > 0 ? result[0].totalRevenue : 0,
            };
        }

        res.json(summary);
    } catch (error) {
        console.error('Error fetching order summary:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/average-order-value', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });
        console.log(tiffin);
        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const periods = ['today', 'thisWeek', 'thisMonth', 'allTime'];
        const aovSummary = {};

        for (const period of periods) {
            const { startDate, endDate } = getDateRange(period);
            const matchQuery = { status: { $in: ['accept', 'preparing', 'ready'] } };

            if (startDate && endDate) {
                matchQuery.orderTime = { $gte: startDate, $lte: endDate }; // Changed back to orderTime
            }

            matchQuery['items.sourceEntityId'] = tiffinId;
            matchQuery['items.sourceEntityName'] = 'Tiffin';

            const result = await Order.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                        totalOrders: { $sum: 1 },
                    },
                },
            ]);

            const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
            const totalOrders = result.length > 0 ? result[0].totalOrders : 0;
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            aovSummary[`${period}AOV`] = averageOrderValue;
        }

        res.json(aovSummary);
    } catch (error) {
        console.error('Error fetching average order value:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/user-summary', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (error) {
        console.error('Error fetching user summary:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/order-analytics', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });

        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const timeframe = req.query.timeframe || 'daily';
        let groupByFormat;
        let sortByField;

        switch (timeframe) {
            case 'daily':
                groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$orderTime" } };
                sortByField = 'date';
                break;
            case 'weekly':
                groupByFormat = { $dateToString: { format: "%Y-%U", date: "$orderTime" } }; // %U for week number
                sortByField = 'week';
                break;
            case 'monthly':
                groupByFormat = { $dateToString: { format: "%Y-%m", date: "$orderTime" } };
                sortByField = 'month';
                break;
            default:
                groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$orderTime" } };
                sortByField = 'date';
                break;
        }

        const matchQuery = {
            status: { $in: ['accept', 'preparing', 'ready'] },
            'items.sourceEntityId': tiffinId,
            'items.sourceEntityName': 'Tiffin',
            orderTime: { $exists: true }
        };

        const result = await Order.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: groupByFormat,
                    orders: { $sum: 1 },
                    totalPurchase: { $sum: '$totalPrice' },
                },
            },
            {
                $project: {
                    _id: 0,
                    [sortByField]: '$_id', 
                    orders: 1,
                    totalPurchase: 1,
                },
            },
            { $sort: { [sortByField]: 1 } },
        ]);

        res.json(result);
    } catch (error) {
        console.error('Error fetching order analytics:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/mealtype-analytics', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });

        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const timeframe = req.query.timeframe || 'Today';
        let startDate = null;
        let endDate = null;

        const now = moment();

        switch (timeframe) {
            case 'Today':
                startDate = now.startOf('day').toDate();
                endDate = now.endOf('day').toDate();
                break;
            case 'This Week':
                startDate = now.startOf('isoWeek').toDate();
                endDate = now.endOf('isoWeek').toDate();
                break;
            case 'This Month':
                startDate = now.startOf('month').toDate();
                endDate = now.endOf('month').toDate();
                break;
            default:
                break;
        }

        const matchQuery = {
            status: { $in: ['accept', 'preparing', 'ready'] },
            'items.sourceEntityId': tiffinId,
            'items.sourceEntityName': 'Tiffin',
            'items.itemType': 'tiffin',
            'items.mealType': { $exists: true, $ne: null }
        };

        if (startDate && endDate) {
            matchQuery.orderTime = { $gte: startDate, $lte: endDate };
        }

        const result = await Order.aggregate([
            { $match: matchQuery },
            { $unwind: '$items' },
            {
                $match: {
                    'items.sourceEntityId': tiffinId,
                    'items.sourceEntityName': 'Tiffin',
                    'items.itemType': 'tiffin',
                    'items.mealType': { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$items.mealType',
                    count: { $sum: '$items.quantity' },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    count: 1,
                },
            },
            { $sort: { count: -1 } },
        ]);

        res.json(result);
    } catch (error) {
        console.error('Error fetching meal type analytics:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


module.exports = router;
