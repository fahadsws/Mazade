const pool = require('../../DB/Database');

async function review(req, res) {
    const {
        review,
        tittle,
        description,
        email,
        from,
        to
    } = req.body;
    try {
        if (!review || !tittle || !description || !email) {
            return res.status(200).json({ status: 400, message: 'Please Field all Fields' });
        }
        pool.query(
            `INSERT INTO review (review, tittle, description, email, \`from\`, \`to\`)
             VALUES (?, ?, ?, ?,?,?)`,
            [
                review,
        tittle,
        description,
        email,
        from,
        to
            ],
            (err, result) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.status(200).json({message:'Review Added Succefuly'})
    
            }
        );
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = review;


