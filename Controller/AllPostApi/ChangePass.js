const pool = require('../../DB/Database')
const bcrypt = require("bcrypt");
const saltRounds = 10;


async function ChangePass(req, res) {
    try {
        const {
            id,
            oldpass,
            newpass
        } = req.body

        if (!oldpass || !newpass) {
            return res.json({ message: 'Please Provide All Fields' })
        }

        const hashpassword = await bcrypt.hash(String(newpass), saltRounds);

        pool.query(`Select * from users where id = ?`,[id],async (err,result)=>{

            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (await bcrypt.compare(oldpass, result[0].password)) {
            } else {
                return res.status(400).json({ status: 400, message: 'Old Password is incorrect' });
            }

            pool.query(`Update users set password = ? where id = ? `,[hashpassword,id],(error,data)=>{
                if (error) {
                    console.error('Error executing SQL query:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.status(200).json({status:200,message:'Password ChnagedSuccefully'})
            })
        })



    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = ChangePass;








