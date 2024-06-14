const pool= require('../../DB/Database')


async function Dashboard(req,res){
    try{
        const {id} = req.params;

        pool.query(`Select * from payement where created_to = ?`,[id],async (err,result)=>{
            if (err) {
                console.error('Error executing second SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            let totalPrice = 0;
            await result.forEach(row => {
                totalPrice += row.price;
            });

            res.status(200).json({status:200,total:totalPrice,sales:result?.length})

        })

    }catch(e){
        res.stats(500).json({message:'Internal Server Error'})
    }
}

module.exports = Dashboard;