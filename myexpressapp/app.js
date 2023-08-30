const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')
app.use(cors())
const { urlencoded } = require('express');
const fileUpload = require("express-fileupload");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(urlencoded({ extended: true }));
app.use(fileUpload());
app.use(bodyParser.json())
const mysql=require('mysql')
const path=require('path')

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'mylearnings'
})
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {

        console.log("connected successfully ")
    }
})

  
app.post('/submit', async (req,res)=>{
    let  data=req.body;
    console.log("entered");
    try {
        let Coming_file = req.files.file;
        let image_Filename = [];
        // console.log(Coming_file,"comming file");
        if (Array.isArray(Coming_file)) {
          for (let index = 0; index < Coming_file.length; index++) {
            const element = Coming_file[index];
            // console.log(element,"element");
            if (element && element.name) {
              // console.log(element.name,"condtion entered");
              image_Filename.push(`http://localhost:4000/${element.name}`);
              // console.log(image_Filename,"image_filename");
              // console.log(path,"path");
              // console.log(__dirname,"__dirname");
              const uploadPaths = __dirname + `/images/` + element.name;
              // console.log(uploadPaths,"uploadpathssss");
              const uploadPath = path.join(__dirname, 'images', element.name);
              await element.mv(uploadPath);
            }
          }
        }
        
        if (image_Filename.length>0) {
          // console.log(image_Filename,"image_filename");
          // console.log(data,"data");  
          try{
              let obj={
                Simage: JSON.stringify(image_Filename),
                StudentName: data.StudentName,
                StudentEmail: data.StudentEmail,
                StudentDOB: data.StudentDOB
              }
               // console.log(obj,"obj");
              connection.query('INSERT INTO studentdetials SET?',[obj],function(error,results,fields){
                if(error){
                console.log(error);
                res.send(error)
              }else{
               console.log("submitted");
               res.send("submitted")
               }
               })
          }catch(error)
          {
             
          }
        }
      } catch (error) {
        console.error('Error during file upload:', error);
        // Handle the error or send an appropriate response
      }
 // file.mv(path.join(__dirname, "/images/") + fileName, function (err) {
    //     if (err) {
    //         console.log(err, "klk");
    //     }

    // });
});
app.post('/post/deleted',(req,res)=>{
  console.log("del entered");
  console.log(req.body,"del body");
  let deldata=req.body;
  console.log(deldata,"deldata");
  let id=deldata.id;
  console.log(id,"sno");
  connection.query(`DELETE from studentdetials where id=${id}`,function(error,results){
      if(error){
          console.log(error);
          throw error;
          }else{
              console.log("results",results);
              res.send("deleted");
          }
  })
})
app.post('/post/updated',async (req,res)=>{
  console.log("update entered");
  let Updatedata= req.body
  let id=Updatedata.id
  try {
    let Coming_file = req.files.file;
    let image_Filename = [];
    if (Array.isArray(Coming_file)) {
      for (let index = 0; index < Coming_file.length; index++) {
        const element = Coming_file[index];
        if (element && element.name) {
          image_Filename.push(`http://localhost:4000/${element.name}`);
          // const uploadPaths = __dirname + `/images/` + element.name;
          const uploadPath = path.join(__dirname, 'images', element.name);
          await element.mv(uploadPath);
        }
      }
    }
    if (image_Filename.length>0) {
      // console.log(image_Filename,"image_filename");
      // console.log(data,"data");  
      try{
          let uobj={
            Simage: JSON.stringify(image_Filename),
            StudentName: Updatedata.StudentName,
            StudentEmail: Updatedata.StudentEmail,
            StudentDOB: Updatedata.StudentDOB
          }
          console.log(uobj,"ubj");
  connection.query(`UPDATE studentdetials SET ? WHERE id=${id} `, [uobj], (error, rows) => {          
      if(error){
            console.log(error);
            res.send(error)
          }else{
           console.log("updated");
           res.send("updated")
           }
           })
      }catch(error)
      {
        console.error('Error during update into db:', error);

      }
    }
  } catch (error) {
    console.error('Error during file upload:', error);
    // Handle the error or send an appropriate response
  }
  // connection.query(`UPDATE studentdetials SET ? WHERE id=${id} `, [Updatedata], (err, rows) => {
  //     if (err) throw err;
  //     console.log(rows, "records ")
  //     res.send("updated")
  // })
})
app.get('/get/viewdetails',(req,res)=>{
  console.log("entered get");
  connection.query("SELECT * FROM studentdetials",function(error,results){
      if(error){
      console.log(error);
      throw error;
      }else{
          console.log("results",results);
          res.send(results);
      }
  })
})
app.listen(port,()=>{
    console.log(`example app listening on port ${port}`);
})

 
//npx kill-port 3000 => solution for port already use problem 