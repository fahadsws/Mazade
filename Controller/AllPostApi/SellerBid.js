const pool = require('../../DB/Database');

async function sellerbid(req, res) {
    const {
        order_id,
        price,
        bid_id,
        created_by
    } = req.body;

    try {
        if (!price) {
            return res.status(200).json({ status: 400, message: 'Please Give Price' });
        }

        // pool.query(
        //     `INSERT INTO seller_bid (order_id, price, bid_id,created_by)
        //      VALUES (?, ?, ?,?)`,
        //     [
        //         order_id,
        //         price,
        //         bid_id,
        //         created_by
        //     ],
        //     (err, result) => {
        //         if (err) {
        //             console.error('Error executing SQL query:', err);
        //             return res.status(500).json({ error: 'Internal Server Error' });
        //         }

        //         pool.query(
        //             `INSERT INTO bid (final_price, total_bids)
        //              VALUES (?, ?)`,[result.insertId,],(errror,data)=>{
                        
        //                 if (err) {
        //                     console.error('Error executing SQL query:', err);
        //                     return res.status(500).json({ error: 'Internal Server Error' });
        //                 }

        //         return res.status(200).json({ status: 200, message: 'Bid Created Successfully' });

        //              })

        //     }
        // );


        pool.query(
            `INSERT INTO seller_bid (order_id, price, bid_id, created_by,status)
             VALUES (?, ?, ?, ?,1)`,
            [
                order_id,
                price,
                bid_id,
                created_by
            ],
            (err, result) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
    
                const insertedId = result.insertId;
    
                // Insert into bid table
                pool.query(
                    `SELECT total_bids FROM bid WHERE id = ?`,
                    [bid_id],
                    (selectError, selectResult) => {
                        if (selectError) {
                            console.error('Error executing SQL query:', selectError);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                
                        const totalBids = selectResult.length > 0 ? selectResult[0].total_bids : 0;
                
                        pool.query(
                            `UPDATE bid
                            SET total_bids = ?,final_price = ?,status = 2
                            WHERE id = ?`,
                            [totalBids + 1,result.insertId,bid_id],
                            (insertError, insertResult) => {
                                if (insertError) {
                                    console.error('Error executing SQL query:', insertError);
                                    return res.status(500).json({ error: 'Internal Server Error' });
                                }
                
                                return res.status(200).json({ 
                                    status: 200, 
                                    message: 'Bid Created Successfully'
                                });
                            }
                        );
                    }


                );
                
            }
        );
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = sellerbid;


