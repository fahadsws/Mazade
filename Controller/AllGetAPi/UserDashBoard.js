const pool = require('../../DB/Database');

async function UserDashBoard(req, res) {
    try {
        const { id } = req.params;

        const getBids = (id) => {
            return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM bid WHERE created_by = ?', [id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        };

        const getPayments = (id) => {
            return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM payement WHERE created_by = ?', [id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        };

        const getSellerBids = (id) => {
            return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM seller_bid WHERE created_by = ?', [id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        };

        const getCompPayments = (id) => {
            return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM payement WHERE created_to = ?', [id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        };

        const [bids, payments, sellerBids, compPayments] = await Promise.all([
            getBids(id),
            getPayments(id),
            getSellerBids(id),
            getCompPayments(id)
        ]);

        const totalCreatedPrice = payments.reduce((sum, payment) => sum + payment.price, 0);
        const totalCompPrice = compPayments.reduce((sum, payment) => sum + payment.price, 0);

        res.status(200).json({
            status: 200,
            user: {
                bid: bids.length,
                total: totalCreatedPrice
            },
            company: {
                bid: sellerBids.length,
                total: totalCompPrice
            }
        });

    } catch (e) {
        console.error('Internal server error:', e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = UserDashBoard;
