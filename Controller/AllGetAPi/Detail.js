const pool = require('../../DB/Database');

async function detail(req, res) {
    try {
        const {id} =  req.params
  pool.query('SELECT * FROM bid where id = ?',[id],(err,result)=>{
    if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query(`Select * from category where id = ?`,[result[0].category],(err,cat)=>{
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({status:200, result,category:cat});
    })
  })
      

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = detail ;
