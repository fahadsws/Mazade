const pool = require('../../DB/Database');

async function filter(req, res) {
  try {
    const { categoryIds } = req.query;
    if (!categoryIds) {
      return res.status(400).json({ error: 'Category IDs are required' });
    }

    const idsArray = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    const placeholders = idsArray.map(() => '?').join(',');
    const sqlQuery = `SELECT * FROM bid WHERE category IN (${placeholders})`;

    pool.query(sqlQuery, idsArray, (error, bids) => {
      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({ status: 200, bids });
    });
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = filter;
