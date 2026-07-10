const db = require('../../db');

module.exports = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user');
        res.json({
            code: 200,
            msg: 'success',
            data: rows
        });
    } catch (error) {
        res.json({
            code: 500,
            msg: '查询失败',
            error: error.message
        });
    }
}