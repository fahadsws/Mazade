const pool = require('../../DB/Database')

async function Status(req,res){
try{
     const {id} = req.params;
     const {status} = req.params;
     pool.query(`UPDATE bid
     SET status = ?
     WHERE id = ?`,[status,id],(err,result)=>{
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error'});
        }

        res.status(200).json({status: 200, message:'Status Changed Succefully'})

    })
}catch(e){
    res.status(500).json({error : 'Internel Server Error'})
}
}

module.exports =Status;