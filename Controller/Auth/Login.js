const pool = require('../../DB/Database');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNTMzMTEzNiwiaWF0IjoxNzE1MzMxMTM2fQ.0fZqi6zZkce5UD69Bk11Kx4neDMzvwPNp9Tt9DVtXzM';

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const hashpassword = await bcrypt.hash(String(password), saltRounds);
        if (!email || !password) {
            return res.status(200).json({ status: 400, message: 'Please Field All Fields' });
        }

        pool.query(`SELECT * FROM users WHERE email = ? OR password = ?`, [email, hashpassword], async (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(200).json({ status: 200, unauthorized: 'User not found' });
            }
            const token = jwt.sign({ id: results[0]?.id, email: email }, secretKey, { expiresIn: '11h' });
            if (await bcrypt.compare(`${password}`, results[0].password)) {
            } else {
                return res.status(200).json({ status: 400, message: 'Password is incorrect' });
            }
            pool.query(`UPDATE users SET rember_me = ? WHERE id = ?`, [token, results[0]?.id], (settingsErr, settingsResults) => {
                if (settingsErr) {
                    console.error('Error executing SQL query for user settings:', settingsErr);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                pool.query(`SELECT * FROM users WHERE id = ?`, [results[0]?.id], (anotherErr, anotherResults) => {
                    if (anotherErr) {
                        console.error('Error executing SQL query for another table:', anotherErr);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({ status: 200, message: 'User logged in successfully', data: { token: token,user:results} });
                });


            });
        });
    } catch (error) {
        console.error('Error processing login request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = loginUser;
