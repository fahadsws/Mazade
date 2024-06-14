const pool = require('../../DB/Database');

async function PaymentHistory(req, res) {
    try {
        const userId = req.body.created_by; 
        console.log("userId= ", userId);

        const query = `
            SELECT bid.*, seller_bid.*, payement.*, category.name as category_name
            FROM bid
            JOIN seller_bid ON bid.final_price = seller_bid.id
            JOIN payement ON payement.price = seller_bid.id
            JOIN category ON bid.category = category.id
            WHERE bid.created_by = ? AND (payement.status = 3 OR payement.status = 5)
        `;

        pool.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(200).json({ status: 404, error: 'No records found for the given user ID' });
            }

            res.status(200).json({ status: 200, data: results });
        });
    } catch (error) {
        console.error('Error in Payment function:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = PaymentHistory;
