const pool = require('../../DB/Database');

async function Code(req, res) {
    try {
        const { code, id } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Provide a Valid Code' }); // Return early if code is not provided
        }

        // Use async/await instead of callback for pool.query
        pool.query('select * from bid where id = ?',[id],async (err,result)=>{

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }


            if (result && result.length > 0) {
                const bid = result[0]; // Get the first row of the result
                if (bid.code === Number(code)) {
                    await pool.query('UPDATE bid SET status = ? WHERE id = ?', [5, id]);
                    await pool.query('UPDATE seller_bid SET status = ? WHERE id = ?', [5, result[0]?.final_price]);

                    return res.status(200).json({ message: 'Code is Correct' });
                } else {
                    return res.status(200).json({ message: 'Code is Incorrect' });
                }
            } else {
                return res.status(404).json({ message: 'Bid not found' });
            }
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = Code;
