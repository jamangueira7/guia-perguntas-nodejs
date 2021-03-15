const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados!');
    })
    .catch((err) => {
        console.log(err);
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC']
        ]}).then((perguntas) => {
        res.render('index', { perguntas });
    });

});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({ where: { id: id } })
        .then((pergunta) => {
            if(pergunta != undefined)  {
                Resposta.findAll({ where: { perguntaId: pergunta.id }, order: [
                        ['id', 'DESC']
                    ]})
                    .then((respostas) => {
                        res.render('pergunta', { pergunta, respostas });
                    });
            } else {
                res.redirect('/');
            }
        });
});

app.post('/salvarpergunta', (req, res) => {
    const { titulo, descricao } = req.body;
    Pergunta.create({
        titulo,
        descricao,
    }).then(() => {
        res.redirect('/');
    });
});

app.post('/responder', (req, res) => {
    const { corpo, perguntaId } = req.body;
    Resposta.create({
        corpo,
        perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`);
    });
});

app.listen(3000, () => { console.log('App rodando!')});
