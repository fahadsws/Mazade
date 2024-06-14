const pool= require('../../DB/Database')

async function Withdrawl(req,res){
    try{
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();

        const {
            created_by,
            price,
            bank_id
        } = req.body;

        if(!price || ! bank_id){
            return res.status(200).json({status:400,message:'Please Provide withdrawl Amount and Bank Id'})
        }

        pool.query(`Insert Into withdrawl (created_by,status,created_at,price,bank_id)
        VALUES(?,?,?,?,?)
        `,[created_by,1,formattedDate,price,bank_id],(err,result)=>{
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({status:200,message:'withdrawl Request Sent Succefully'})
        })
    }catch(e){
        res.status(500).json({message:'Internal Server Error'})
    }
}


module.exports = Withdrawl;