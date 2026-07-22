const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('../../db');

// 上传目录
const uploadDir = path.join(__dirname, '../../uploads');
// 确保上传目录存在
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true});
};

// 存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    }
});

// 限制上传文件大小5MB
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }});

module.exports = (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.json({ code: 400, msg: '上传失败，文件过大或格式错误', error: err.message });
        }
        if (!req.file) {
            return res.json({ code: 400, msg: '未选择上传文件' });
        }
        try {
            // 生成全局唯一UUID作为fileId
            const fileId = uuidv4();
            const fileData = {
                file_id: fileId,
                file_name: req.file.filename,
                original_name: req.file.originalname,
                file_size: req.file.size,
                file_url: `http://localhost:3000/uploads/${req.file.filename}`
            };

            // 插入数据库
            await db.query(
            `INSERT INTO file_info(file_id, file_name, original_name, file_size, file_url) VALUES (?,?,?,?,?)`,
            [fileData.file_id, fileData.file_name, fileData.original_name, fileData.file_size, fileData.file_url]
            );

            res.json({
                code: 200,
                msg: '文件上传并入库成功',
                data: fileData
            });
        } catch (dbErr) {
            // 数据库写入失败，删除本地文件
            fs.unlinkSync(req.file.path);
            res.json({ code: 500, msg: '文件入库失败，已删除本地文件', error: dbErr.message });
        }
    });
}