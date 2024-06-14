const pool = require('../../DB/Database')


async function Edit(req,res){
    try{
        const {
            id,
            first_name,
            last_name,
            phone,
            email,
            address
        } = req.body;
        if(!first_name || !last_name || !phone ||  !email || !address){
            return res.status(200).json({message : 'All Fields Are Required'})
        }
        pool.query(`Update users SET first_name = ? , last_name = ?  , phone = ?,
        email = ? , address = ? where id = ?
        `,[
            first_name,
            last_name,
            phone,
            email,
            address,
            id
        ],(err,result)=>{
            if(err){
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

         res.status(200).json({status:200,message:'Profile Updated Succefully'})

        })

    }catch(e){
        res.status(500).json({message:'Internal Server Error'})
    }
}

module.exports = Edit;