const pool = require('../../DB/Database');

async function WithDrawelHistory(req,res){
    try{
        const {id} = req.params;

        pool.query(`Select * from withdrawl where created_by = ?`,[id],(err,reslut)=>{
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({status:200,reslut})
        })

    }catch(e){
        res.status(500).json({message:'Internal Server Error'})
    }
}

module.exports = WithDrawelHistory;