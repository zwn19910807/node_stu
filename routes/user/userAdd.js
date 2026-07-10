const db = require('../../db');

module.exports = async (req, res) => {
    try {
        const { name, age } = req.body;
        if (!name) {
            return res.json({
                code: 400,
                msg: '用户名name不能为空'
            });
        }
        const [existRows] = await db.query('SELECT id FROM user WHERE name = ?', [name]);
        if (existRows.length > 0) {
            return res.json({
                code: 409,
                msg: `用户名【${name}】已存在，请勿重复添加`
            });
        }
        const [result] = await db.query('INSERT INTO user (name, age) VALUES (?, ?)', [name, age]);
        res.json({
            code: 200,
            msg: '添加成功',
            data: { id: result.insertId, name, age }
        });
    } catch (error) {
        res.json({
            code: 500,
            msg: '添加失败',
            error: error.message
        });
    }
}