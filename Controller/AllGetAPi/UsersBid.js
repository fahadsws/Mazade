const pool = require('../../DB/Database');

async function bids(req, res) {
    try {
        const {id} =  req.params
  pool.query('SELECT * FROM bid where created_by = ? AND status NOT IN (3, 5)',[id],(err,bids)=>{
    if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json({status:200, bids});
  })
      

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = bids ;
