import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

////////////////////////////////////////////////////Το section με τις πληροφοριες///////////////////////////////////////////////////////////////////////////////////////
let posts = [
  {
    id: 1,
    title: "Title of post n1",
    content:
      "Content of post n1",
    author: "author of post n1",
  },
  {
    id: 2,
    title: "Title of post n2",
    content:
      "Content of post n2",
    author: "author of post n2",
  },
  {
    id: 3,
    title: "Title of post n3",
    content:
      "Content of post n3",
    author: "author of post n3",
  },
];



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//////////////////////////////////////////////Το section που εμφανιζει ολα τα posts//////////////////////////////////////////////////////////////////////////
app.get("/GetPostsApi",(req,res)=>{//Εμφανιζει ολα τα στοιχεια του πινακα posts.

  
  res.json(posts);

})
////////////////////////////////////////////Το section που δημιουργει το νεο post///////////////////////////////////////////////////////////////////////////
app.post("/AddNewPostApi",(req,res)=>{//Προσθετει ενα post στον πινακα posts.

  //console.log(req.body);
  const JsObj = { id:(posts.length)+1 , title: req.body.title , content: req.body.content , author: req.body.author }
  posts.push(JsObj);
  //console.log(posts);
  res.json(posts);

})
//////////////////////////////////////////Tο section που τρεχει οταν κανουμε edit///////////////////////////////////////////////////////////////////////////
app.get("/returnPostApi/:id",(req,res)=>{//Επιστρεφει το αντικειμενο που εχει πατησει ο χρηστης το κουμπι Edit.
  
  const Id = parseInt(req.params.id); //Το κανει int απο string
   
  const post = posts.find((post) => post.id === Id);

  //console.log(post);

  res.json(post);
   
})

app.patch("/PatchPostApi/:id",(req,res) => {/////////κανει edit το αντικειμενο που θελει ο χρηστης.
  
  //console.log(req.body);
  //console.log(req.params.id);

  const Id = parseInt(req.params.id);
  const Existing = posts.find((post)=> post.id === Id);
  const Index = posts.findIndex((post) => post.id === Id);

  //console.log(Index);
  //console.log(Existing);

  if(req.body.title !== ""){Existing.title = req.body.title;}
  if(req.body.content !== ""){Existing.content = req.body.content;}
  if(req.body.author !== ""){Existing.author = req.body.author;}
  
  posts[Index] = {id:Existing.id , title:Existing.title ,content:Existing.content,author:Existing.author}
  
  res.json(posts);
})
//////////////////////////////Τo section που κανουμε delete ενα post//////////////////////////////////////////////////////////////////////////////////////////////

app.delete("/DeletePostApi/:id",(req,res)=>{

  const Id = parseInt(req.params.id);
  const DeleteIndex = posts.findIndex((post)=>post.id === Id);
  if ( DeleteIndex !== -1) { posts.splice(DeleteIndex, 1);}

  res.json(posts);
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
