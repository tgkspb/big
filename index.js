const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Post = require('./models/post')

const PORT = process.env.PORT || 80

const app = express()

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

app.get('/', async (req, res) => {
    
    const max_count_db = await Post.count()
    let num = []
    let lnk_max = (5)

    for(var i = 0; i < lnk_max; i++){
        num.push(Math.floor(Math.random() * max_count_db))
     }

    const posts = await Post.find( { 'id' : { $in: num} }).select({id:1,title:1,imgurl:1}).lean()

    res.render('index', {
      title: 'Home page',
      posts
    })
  
  })

app.get('/:id', async (req, res) => {
    res.header('Content-Type', 'text/html; charset=utf-8');
    const post = await Post.findById(req.params.id).lean()
    const max_count_db = await Post.count()
    let num = []
    let lnk_max = (5)

    for(var i = 0; i < lnk_max; i++){
        num.push(Math.floor(Math.random() * max_count_db))
     }

    const post_related = await Post.find( { 'id' : { $in: num} }).select({id:1,title:1}).lean()

    res.render('post', {
        title: post.title,
        post,
        post_related
      })
})

app.get('/maps/sitemap.xml', async function(req, res, next){

    const max_count_db = await Post.count()

    let num = []
    let lnk_max = 500

    for(var i = 0; i < lnk_max; i++){
        num.push(Math.floor(Math.random() * max_count_db))
     }

    const links = await Post.find( { 'id' : { $in: num} }).select({id:1}).lean()

    res.header('Content-Type', 'application/xml');
    res.render('sitemap', {
      layout: false,
      links,
      domain: req.get('host')
    });
})

async function start() {
    try {
        await mongoose.connect('mongodb+srv://goldman:kVZmxjW5xdrb!4a@cluster0.g2rfq.mongodb.net/posts', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
        })
        app.listen(PORT, '0.0.0.0', () =>{
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()
