const pool = require('../../DB/Database')


async function Dashboard(req,res){
    try{
        const {id} = req.params

        pool.query('SELECT * FROM bid where created_by = ?',[id],(err,bids)=>{
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error'});
            }
            return res.status(200).json({status:200, bid:{count:bids.lengths}});
          })
              

    }catch(e){
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

module.exports = Dashboard;