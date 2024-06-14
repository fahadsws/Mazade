const pool = require('../../DB/Database')

async function CanceledBid(req,res){
    try{
       const {id} = req.params

       pool.query('Select * from bid where status = 3 And created_by = ?',[id],(error,bids)=>{
        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ error: 'Internal Server Error'});
        }

        return res.status(200).json({ status: 200, bids });
       })


    }catch(e){
        res.status(500).json({message:'Internal Server Error'})
    }

}

module.exports = CanceledBid;