const db = require('../../db');

module.exports = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.json({
                code: 400,
                msg: 'id参数不能为空'
            });
        }
        const [result] = await db.query('DELETE FROM user WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.json({
                code: 200,
                msg: '删除成功',
                deleteId: id
            });
        } else {
            res.json({
                code: 400,
                msg: '删除失败,ID不存在'
            });
        }
    } catch (err) {
        res.json({
            code: 500,
            msg: '服务器删除异常',
            error: err.message
        });
    }
}