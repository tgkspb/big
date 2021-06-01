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
    const posts = await Post.aggregate([{$sample: {size: 5}}])
    res.render('index', {
      title: 'Home page',
      posts
    })
  
  })


app.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).lean()
    const post_related = await Post.aggregate([{$sample: {size: 5}}])

    res.render('post', {
        title: post.title,
        post,
        post_related
      })
    //res.send('<h2>'+post.title+'</h2>' + '<p>'+post.descr+'</p>')
})


async function start() {
    try {
        await mongoose.connect('mongodb://195.123.215.71:27017/posts', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
        })
        app.listen(PORT, () =>{
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()