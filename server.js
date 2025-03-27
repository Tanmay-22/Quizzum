
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "quizzum_db",
  password: "2208",
  port: 5432,
});

db.connect();

const app = express();

var currentusername = '';


app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 


app.set("view engine", "ejs");


app.use(express.static("public"));


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.render("index",{user:currentusername});
  console.log(currentusername);
});


app.get("/login", (req, res) => {
    res.render("login",{user:currentusername});
  });

app.get("/signup", (req, res) => {
    res.render("signup",{user:currentusername});
  });

  app.get("/leaderboard", async (req, res) => {
    const leader = await db.query("select username , score from userinfo order by(score) desc ;");
    
      console.log(leader.rows);
    res.render("leaderboard",{user:currentusername,rowdata:leader.rows});
  });
  app.get("/contactus", (req, res) => {
    res.render("contactus",{user:currentusername});
  });

  app.get("/question", (req, res) => {
    res.render("question",{user:currentusername});
    
  });
  app.get("/categories", (req, res) => {
    res.render("categories",{user:currentusername});
  });
  app.get("/about", (req, res) => {
    res.render("about",{user:currentusername});
  });
  // app.get("/result", (req, res) => {
  //   res.render("result");
  // });

  // app.get("/achievements", (req, res) => {
  //   res.render("achievements");
  // });

  app.get("/profile", (req, res) => {
    res.render("profile",{user:currentusername});
  });

  app.get("/redeem", (req, res) => {
    res.render("redeem",{user:currentusername});
  });

  app.get("/edit-profile", (req, res) => {
    res.render("edit-profile",{user:currentusername});
  });
  app.get("/test", (req, res) => {
    res.render("test",{user:currentusername});
  });




  app.get("/signout",(req,res)=>{
    currentusername = "";
    res.redirect("/");
  });

  let questions = null;  // Store questions globally

  async function fetchQuizData(url) {
      try {
          console.log(`Fetching questions from: ${url}`);
          const response = await fetch(url);
          
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          // console.log("Questions received from API:", data);
          
          return data; // Return the fetched data
      } catch (error) {
          console.error("Error fetching quiz data:", error);
          return null;
      }
  }
  
  app.post("/science_quiz", async (req, res) => {
      console.log("1 - Science Quiz Requested");
      questions = await fetchQuizData("https://opentdb.com/api.php?amount=10&category=17");
      if (!questions) {
          return res.status(500).send("Error fetching quiz questions");
      }
      res.render("test",{response:questions});
  });

  app.post("/history_quiz", async (req, res) => {
      console.log("2 - History Quiz Requested");
      questions = await fetchQuizData("https://opentdb.com/api.php?amount=10&category=23");
      if (!questions) {
          return res.status(500).send("Error fetching quiz questions");
      }
      res.render("test",{response:questions});
  });
  
  app.post("/geography_quiz", async (req, res) => {
      console.log("3- Geography Quiz Requested");
      questions = await fetchQuizData("https://opentdb.com/api.php?amount=10&category=22");
      if (!questions) {
          return res.status(500).send("Error fetching quiz questions");
      }
      res.render("test",{response:questions});
  });
  
  app.post("/sports_quiz", async (req, res) => {
      console.log("4- Sports Quiz Requested");
      questions = await fetchQuizData("https://opentdb.com/api.php?amount=10&category=21");
      if (!questions) {
          return res.status(500).send("Error fetching quiz questions");
      }
      res.render("test",{response:questions});
  });
  app.post("/technology_quiz", async (req, res) => {
      console.log("4- Technology Quiz Requested");
      questions = await fetchQuizData("https://opentdb.com/api.php?amount=10&category=18");
      if (!questions) {
          return res.status(500).send("Error fetching quiz questions");
      }
      res.render("test",{response:questions});
  });
  
  app.post("/movies_quiz", async (req, res) => {
      console.log("4- Movies Quiz Requested");
      questions = await fetchQuizData("https://opentdb.com/api.php?amount=10&category=11");
      if (!questions) {
          return res.status(500).send("Error fetching quiz questions");
      }
      res.render("test",{response:questions});
  });
  
  

  


  
  
  app.post('/sign_up_entry', async (req, res) => {
    
    try{
      const { username, email, password } = req.body;
      await db.query("INSERT INTO userinfo (username, password) VALUES ($1, $2)", [username, password]);
      currentusername = username;
    }
    catch(err){
      console.log(err);
    }
    res.redirect("/");
  });



  app.post('/login_entry',async(req,res)=>{
    
    try{
      const username = req.body.username;
      const password = req.body.password;
      const result = await db.query(`select * from userinfo where username = '${username}' and password='${password}'`);
      currentusername = username;

      if(result.length==0){ 
        res.render("/signup");
      }
    }
    catch(err){
      console.log("Error in login");
    }
    res.redirect("/"); 
  });


  app.post('/insert_result',async(req,res)=>{
    if(currentusername){
    try{
      
      const username = currentusername;
      const score = parseInt(req.body.score);
      console.log(score);
      const result = await db.query("update userinfo SET score = GREATEST($1,score) WHERE username = $2", [score, username]);
      res.status(200);
      console.log("score entered"); 
    }
    catch(err){
      console.log("Error in inserting score");
    }
  }
  });

