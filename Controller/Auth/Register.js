const pool = require('../../DB/Database');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNTMzMTEzNiwiaWF0IjoxNzE1MzMxMTM2fQ.0fZqi6zZkce5UD69Bk11Kx4neDMzvwPNp9Tt9DVtXzM';


async function Register(req, res) {
    const {
        first_name,
        last_name,
        password,
        confirmpass,
        phone,
        address,
        city,
        zipcode,
        email,
        role
    } = req.body;

    try {
        if(password != confirmpass){
            return res.status(200).json({ status: 400, message: 'Confirm Password is not Mached' });
        }
        if(!first_name || !last_name || !password || !phone || !email || !address || !confirmpass || !city || !zipcode){
            return res.status(200).json({ status: 400, message: 'Please Field All Fields' });
        }
        const hashpassword = await bcrypt.hash(String(password), saltRounds);
        pool.query(
            `INSERT INTO users (first_name, last_name, 
                password, phone, address,city,zipcode,email,role)
             VALUES (?, ?, ?, ?, ?, ? ,?,?,?)`,
            [
                first_name,
        last_name,
        hashpassword,
        phone,
        address,
        city,
        zipcode,
        email,
        role
            ],
            (err, result) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                return res.status(200).json({ status: 200, message: 'User Register Successfully' });
            }
        );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = Register;
