const pool = require('../../DB/Database');

async function CompleteddBid(req, res) {
    try {
        const { id } = req.params;

        pool.query(`SELECT * FROM seller_bid WHERE created_by = ?`, [id], (err, sellerBids) => {
            if (err) {
                console.error('Error executing first SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const bidIds = sellerBids.map(bid => bid.bid_id);

            if (bidIds.length === 0) {
                return res.status(404).json({ message: 'No bids found for the specified user' });
            }

            const query = `SELECT * FROM bid WHERE id IN (?) AND status = 5`;
            pool.query(query, [bidIds], (err, bids) => {
                if (err) {
                    console.error('Error executing second SQL query:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.status(200).json({status:200,bids});
            });
        });
    } catch (e) {
        console.error('Error in CancledBid function:', e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = CompleteddBid;
