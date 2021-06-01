const express = require('express')
//const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const postRoutes = require('./routes/posts')
//const redis = require('redis')
//const util = require('util')
//const clearCache   = require('./services/cache')
//const cache = require('express-redis-cache')();
//require("./services/cache"); 

// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database('./data/content.db')


const PORT = process.env.PORT || 80

const app = express()


// Шаблонизатор handlebars

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers:{
        substr: function (length, context, options) { 
            if ( context.length > length ) {
                return context.substring(0, length) + "...";
               } else {
                return context;
               }
         }
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))

app.use(postRoutes)


// 

// Подключение к базе данных
async function start() {
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/posts', {
        //     useNewUrlParser: true,
        //     useFindAndModify: false,
        //     useUnifiedTopology: true
        // })
        app.listen(PORT, () =>{
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}
// 

// app.get("/testdb/:id", (req, res) => {
//     let id = req.params.id
//     db.serialize(function() {
//     db.get(`SELECT * FROM posts WHERE id = ?`, id, function(err, rows){
//         //console.log(err);
//         console.log(rows.title)
//         res.send(
//             '<h2>'+rows.title+'</h2>'+
//             '<p>'+rows.descr+'</p>'
//             )
//     })
// })
// })


// app.get('*', function(req, res){
//     res.send('404', 404);
//   });


start()

