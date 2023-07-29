const express = require('express')
const cors = require('cors')
const {encrypt,decrypt}=require("./EncryptionHandler.js");

const app=express();
const mysql=require('mysql');
const PORT=3001;

const db = mysql.createConnection({
    user: 'root',
    host:  'localhost',
    password: 'MySQL@123',
    database: 'passwordmanager',
});


app.use(cors());
app.use(express.json());

app.post("/addpassword", (req, res) => {
    const { password, title } = req.body;
    const hashedPassword = encrypt(password);
    db.query(
      "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)",
      [hashedPassword.password, title, hashedPassword.iv],
      (err, result) => {
        if (err) {
          console.log("error");
        } else {
          res.send("Success");
        }
      }
    );
  });

app.post('/decryptpassword',(req,res)=>{
    res.send(decrypt(req.body))
})


app.get("/showpasswords", (req, res) => {
    db.query("SELECT * FROM passwords;", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});
app.get('/',(req,res)=>
{
    res.send("Hello world");
});
app.listen(PORT,()=>{
    console.log('server is running');
});