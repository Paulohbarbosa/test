const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://paulo:janeiro12@primeiro.otzfp.mongodb.net/primeiro?retryWrites=true&w=majority"

MongoClient.connect(uri, (err, client) => {

    if (err) return console.log(err)
    db = client.db('primeiro')

    app.listen(3000, function () {
        console.log('Server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

// ------------------------------- configuração do Paulo -------------------------

//variáveisS
let colecao = 'data';
var pgPrincipal = "paulo/index.ejs";
let pgCadastro = "paulo/cadastro.ejs";

//pagina principal
app.get('/', (req, res) => {
    db.collection(colecao).find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render(pgPrincipal, { data: results })

    })
})

//página de cadastro
app.get('/cadastro', (req, res) => {
    let cursor = db.collection(colecao).find()
    res.render(pgCadastro)
})

app.post('/cadastro', (req, res) => {
    db.collection(colecao).save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('salvo no banco de dados')
        res.redirect('/')
    })
})

//função editar
app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection(colecao).find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('paulo/edit', { data: result })
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var name = req.body.name
        var sobrenome = req.body.sobrenome
        var email = req.body.email
        var tel = req.body.tel
        var endereco = req.body.endereco
        var cidade = req.body.cidade
        var uf = req.body.uf
        var profissao = req.body.profissao
       

        db.collection(colecao).updateOne({ _id: ObjectId(id) }, {
            $set: {
                name: name,
                sobrenome: sobrenome,
                email: email,
                tel: tel,
                endereco: endereco,
                cidade: cidade,
                uf: uf,
               profissao : profissao
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/')
            console.log('Atualizado no banco de dados')
        })
    })

//função excluir
app.route('/delete/:id').get((req, res) => {
    var id = req.params.id

    db.collection(colecao).deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Pagado do Banco de dados!')
        res.redirect('/')
    })
})
