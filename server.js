var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const serverPort = 5000;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

app.get('/', (req, res) => {
    res.json('hi');
});


var transport = {
	host: process.env.HOST,
	port: process.env.MAILPORT,
    secure: false,
	auth: {
		user: process.env.USER,
		pass: process.env.PASS,
	},
};

var transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

router.post('/send', (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var number = req.body.number;
    var message = req.body.message;
    var senderEmail = `<${process.env.EMAIL}>`;
    var content = `Nombre: ${name} \n Numero: ${number} \n Email: ${email} \n Mensaje: ${message} `;
    var mail = {
        from: senderEmail,
        to: 'crystal12.duran@gmail.com',
        subject: `Nuevo Correo - ${name}`,
        text: content,
    };

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail',
            });
        } else {
            res.json({
                status: 'success',
            });
        }
    });
});

app.listen(serverPort, () => console.log(`backend is running on port ${serverPort}`));
