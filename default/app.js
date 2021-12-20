const express = require('express');

const websocket = require('./socket/socket');

const app = express();
app.set('port', 3000);

app.use((req, res, next) => {
    next();
});

const indexRouter = require('./default');
app.use('/', indexRouter);


app.use(function (err, req, res, next) {
    console.error(err);
    res.send('에러가 발생하였습니다.');
});


const server = app.listen(app.get('port'), function () {
    console.log('서버 실행중...');
});

websocket(server);