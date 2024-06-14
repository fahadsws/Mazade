const pool = require('../../DB/Database');

async function price(req, res) {
    try {
        const {id} =  req.params
  pool.query('SELECT * FROM seller_bid where id = ?',[id],(err,result)=>{
    if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
        const { price } = result[0];
        const { status } = result[0];

        return res.status(200).json({status:200, price:price,info:status});
  })
      

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = price ;
