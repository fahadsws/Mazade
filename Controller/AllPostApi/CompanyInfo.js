
const pool = require('../../DB/Database');

async function CompanyInfo(req, res) {
    try {
        const userId = req.body.id; 
        console.log("userId= ", userId);

        const query = `
            SELECT bid.*, users.*, seller_bid.*
            FROM bid
            JOIN seller_bid ON bid.id = seller_bid.bid_id
            JOIN users ON seller_bid.created_by = users.id
            WHERE bid.id = ?
        `;

        pool.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ status: 404, error: 'No records found for the given bid ID' });
            }

            res.status(200).json({ status: 200, data: results });
        });
    } catch (error) {
        console.error('Error in CompanyInfo function:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = CompanyInfo;

