// const pool = require('../../DB/Database');

// async function addbid(req, res) {
//     const {
//         tittle,
//         quality,
//         budget,
//         city,
//         quantity,
//         description,
//         category,
//         time_left,created_by
//     } = req.body;


//         const prefix = 'MZ';
//         const date = new Date();
//         const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
//         const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
//         const day = date.getDate().toString().padStart(2, '0'); // Day (01-31)
//         const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Random number (0000-9999)

//     try {
//         if (!tittle || !description || !quality || !budget || !city || !quantity || !description || !category || !created_by) {
//             return res.status(200).json({ status: 400, message: 'Please Fill All Fields' });
//         }
//         pool.query(
//             `INSERT INTO bid (tittle, 
//                 quality, budget, 
//                 city, quantity, description, category, time_left, status,order_id,created_by)
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
//             [
//                 tittle,
//                 quality,
//                 budget,
//                 city,
//                 quantity,
//                 description,
//                 category,
//                 time_left,
//                 1,`${prefix}${year}${month}${day}${randomNumber}`,created_by
//             ],
//             (err, result) => {
//                 if (err) {
//                     console.error('Error executing SQL query:', err);
//                     return res.status(500).json({ error: 'Internal Server Error' });
//                 }
//                 return res.status(200).json({ status: 200, message: 'Bid Created Successfully' });
//             }
//         );
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

// module.exports = addbid;


const pool = require('../../DB/Database');
const cron = require('node-cron');

async function addbid(req, res) {
    const {
        tittle,
        quality,
        budget,
        city,
        quantity,
        description,
        category,
        time_left,
        created_by
    } = req.body;

    const prefix = 'MZ';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
    const day = date.getDate().toString().padStart(2, '0'); // Day (01-31)
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Random number (0000-9999)

    try {
        if (!tittle || !description || !quality || !budget || !city || !quantity || !category || !created_by) {
            return res.status(200).json({ status: 400, message: 'Please Fill All Fields' });
        }

        const orderId = `${prefix}${year}${month}${day}${randomNumber}`;

        pool.query(
            `INSERT INTO bid (tittle, quality, budget, city, quantity, description, category, time_left, status, order_id, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                tittle,
                quality,
                budget,
                city,
                quantity,
                description,
                category,
                time_left,
                1,
                orderId,
                created_by
            ],
            (err, result) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                // Schedule the status update after 24 hours 
                const job = cron.schedule('0 0 0 * * *', () => {
                    pool.query(
                        'UPDATE bid SET status = 6 , time_left = ? WHERE order_id = ?',
                        ['Expired',orderId],
                        (err, result) => {
                            if (err) {
                                console.error('Error executing SQL query for status update:', err);
                            } else {
                                console.log('Bid status updated to 6 for order_id:', orderId);
                            }
                        }
                    );
                }, {
                    scheduled: true,
                    timezone: "Asia/Kolkata" // Set to Indian Standard Time
                });

                // Stop the job after it runs once
                setTimeout(() => {
                    job.stop();
                }, 86400000 ); // 24 hours in milliseconds 

                return res.status(200).json({ status: 200, message: 'Bid Created Successfully' });
            }
        );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = addbid;
