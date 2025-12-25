const express = require('express')
const fs= require('fs')
const app=express()
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
app.use(express.json())
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.get('/',(req,res)=>{
try {
    fs.readdir('./files',(err,files)=>{       
        res.render("index",{files:files})
    })
} catch (error) {
    res.status(400).json({error:error.message})
}

})

app.post('/create',(req,res)=>{
    try {
        const {title ,desc} = req.body

        fs.writeFile(`./files/${title.split(' ').join("")}.txt`,desc,(err)=>{
            if(err){
                console.log(err);
            }
            res.redirect('/')
        })
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


app.get('/edit/:filename', (req, res) => {
    const { filename } = req.params

    fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
        if (err) {
            return res.status(404).send("Data not found")
        }

        res.render('edit', {
            filename: filename,
            data: data
        })
    })
})

app.post('/update/:filename',(req,res)=>{
const {filename} = req.params
const {data,old,newValue} = req.body

const newFile = newValue.split(' ').join('')+".txt"

fs.rename(`./files/${old}`,`./files/${newFile}`,(err)=>{
    if(err){
        return res.status(400).json(err)
    } 
})



fs.writeFile(`./files/${filename}`,data,(err)=>{
    if(err){
        return res.status(400).json({err:err})
    }
    res.redirect('/')
})

})

app.get('/files/:filename',(req,res)=>{
    try {
        const {filename} = req.params

        fs.readFile(`./files/${filename}`,'utf-8',(err,data)=>{
               if(err){
                 throw new Error ("Data not found")
               }
                res.render('show', {data:data,filename:filename})
        })
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

app.get('/delete/:filename',(req,res)=>{
    const {filename} = req.params
    fs.unlink(`./files/${filename}`,(err)=>{
        if(err){
            return res.status(400).json(err)
        }
        res.redirect('/')
    })
    
})
app.listen(process.env.PORT,()=>{
    console.log("Server is running on PORT " + process.env.PORT);
    
})


