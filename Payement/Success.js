require('dotenv').config();
const pool = require('../DB/Database');
const paypal = require('paypal-rest-sdk');


async function Success(req, res) {
    const { pay } = req.query
    const { by } = req.query
    const { final } = req.query



    paypal.configure({
        'mode': 'sandbox',
        'client_id': process.env.PAYEMENT_CLIENT_ID,
        'client_secret': process.env.PAYEMENT_CLIENT_SECRET
    });

    try {
        var PayerId = req.query.PayerID;
        var paymentId = req.query.paymentId;
        var randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999


        console.log("PayerId:", PayerId);
        console.log("paymentId:", paymentId);

        var execute_payment_json = {
            "payer_id": PayerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": `${pay}`
                }
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.error("Error executing payment:", error.response);
                return res.status(400).json({ error: 'Error executing payment', details: error.message });
            } else {
                pool.query('Select * from seller_bid where id = ? ', [final], ((err, result) => {
                    if (err) {
                        console.error('Error executing SQL query:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
        
                    pool.query(`INSERT INTO payement (payement_id, created_by, created_to, price, status) 
                        VALUES (?, ?, ?, ?, ?)`, [paymentId, by, result[0]?.created_by, result[0]?.id, 5], (err, data) => {
                        if (err) {
                            console.error('Error executing SQL query:', err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
        
                        pool.query('UPDATE bid SET payement_code = ?,status = ?,code = ? WHERE created_by = ? && final_price = ?', [data?.insertId,1,randomNumber, by,final], (e, r) => {
                            if (e) {
                                console.error('Error executing SQL query:', e);
                                return res.status(500).json({ error: 'Internal Server Error' });
                            }


                            pool.query('UPDATE seller_bid SET status = ? WHERE id = ?', [4,final], (e, r) => {
                                if (e) {
                                    console.error('Error executing SQL query:', e);
                                    return res.status(500).json({ error: 'Internal Server Error' });
                                }
                                res.redirect(`myapp://payment-success?paymentId=${paymentId}&amount=${req.query.pay}`);
                            });
                        });
                    });
                }));
            }
        });
        

    } catch (e) {
        console.error("Error in Success function:", e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = Success;
