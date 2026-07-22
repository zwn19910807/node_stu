const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const userList = require('./routes/user/userList');
const userAdd = require('./routes/user/userAdd');
const userDelete = require('./routes/user/userDelete');

const fileUpload = require('./routes/file/upload');

app.use(cors());
app.use(express.json());

app.get('/api/user/list', userList);
app.post('/api/user/add', userAdd);
app.post('/api/user/delete', userDelete);

app.post('/api/file/upload', fileUpload);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});