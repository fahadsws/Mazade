const pool = require('../../DB/Database');

function company(req, res) {
    try {
        const { id } = req.params;

        pool.query('SELECT * FROM seller_bid WHERE created_by = ?', [id], (err, sellerBids) => {
            if (err) {
                console.error('Error executing first SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (sellerBids.length === 0) {
                return res.status(404).json({ error: 'No bids found for this user' });
            }

            const bidIds = sellerBids.map(bid => bid.bid_id);
            const placeholders = bidIds.map(() => '?').join(',');

            pool.query(`SELECT * FROM bid WHERE id IN (${placeholders})`, bidIds, (err, bids) => {
                if (err) {
                    console.error('Error executing second SQL query:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                const result = sellerBids.map(sellerBid => {
                    const bid = bids.find(b => b.id === sellerBid.bid_id);
                    return { ...sellerBid, bid };
                });

                return res.status(200).json({ status: 200, bids });
            });
        });
    } catch (error) {
        console.error('Error in company function:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = company;
