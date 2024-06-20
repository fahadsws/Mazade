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
                pool.query('SELECT * FROM payement WHERE created_by = ?', [id], async (err, results) => {
                    if (err) {
                        return reject(err);
                    }
        
                    const bidIds = await results.map(bid => bid.price); // Assuming bid has an id field, adjust as per your schema
                    if (bidIds.length === 0) {
                        resolve(0); // Resolve with a default value or handle empty case as needed
                        return;
                    }
        
                    pool.query('SELECT * FROM seller_bid WHERE id IN (?) AND status = 5', [bidIds], (err, bids) => {
                        if (err) {
                            console.error('Error executing second SQL query:', err);
                            return reject(err);
                        }
        
                        let totalPrice = 0;
                        bids.forEach(row => {
                            totalPrice += row.price;
                        });
        
                        resolve(totalPrice);
                    });
        
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
                pool.query('SELECT * FROM payement WHERE created_to = ?', [id], async (err, results) => {
                    if (err) {
                        return reject(err);
                    }
        
                    const bidIds = results.map(bid => bid.price); // Assuming bid has an id field, adjust as per your schema
        
                    if (bidIds.length === 0) {
                        resolve(0); // Resolve with a default value or handle empty case as needed
                        return;
                    }
        
                    pool.query('SELECT * FROM seller_bid WHERE id IN (?)', [bidIds], async (err, bids) => {
                        if (err) {
                            console.error('Error executing second SQL query:', err);
                            return reject(err);
                        }
        
                        let totalPrice = 0;
                        bids.forEach(row => {
                            totalPrice += row.price;
                        });
        
                        resolve(totalPrice);
                    });
        
                });
            });
        };
        

        const [bids, payments, sellerBids, compPayments] = await Promise.all([
            getBids(id),
            getPayments(id),
            getSellerBids(id),
            getCompPayments(id)
        ]);

       
        res.status(200).json({
            status: 200,
            user: {
                bid: bids.length,
                total: payments
            },
            company: {
                bid: sellerBids.length,
                total: compPayments
            }
        });

    } catch (e) {
        console.error('Internal server error:', e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = UserDashBoard;
