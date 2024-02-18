import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express(); //Δημιουργουμε ενα αντικειμενο τυπου express.
const port = 3000; //Θετουμε το port του localhost στο οποιο μπορουμε να βρισκουμε το server.
const API_URL = "http://localhost:4000"; ///////////////////////////////////////

app.use(express.static("public"));//Θετουμε το φακελο στον οποιο εχουμε αποθηκευμενα τα static files.
//Απο τον φακελο public θα καθοριστει το route που θα κανουμε link τα files μας στο αρχειο ejs.

app.use(bodyParser.urlencoded({ extended: true }));//Δημιουργει body στο request.
app.use(bodyParser.json());





//Κανουμε handle τα get request τα οποια γινονται στο endpoint "/" με σκοπο να μας επιστρεψει την αρχικη σελιδα με τον πινακα posts.
app.get("/", async (req, res) => {
  
  try {
    const response = await axios.get(`http://localhost:4000/GetPostsApi`);//Κανουμε ενα get request στο API μας στο endpoint /posts.
    const JsObj = response.data; //Αποθηκευουμε την πληροφορια που μας επιστρεφει στο javascript obj.
    //console.log(JsObj)
    res.render("index.ejs", { posts: JsObj });//Περναμε το αντικειμενο στο αρχειο ejs ωστε να μπορουμε να εμφανισουμε τα πεδια που χρειαζομαστε.
  }catch(error){
    res.status(500).json({ message: "Error fetching posts" });//Σε περιπτωση error εμφανιζουμε ενα json μηνυμα.
  }
});





app.get("/new", (req, res) => {//Μας επιστρεφει την σελιδα modify.ejs οπου μπορουμε να δημιουργησουμε ενα νεο post.

  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });// Mας οδηγει στο endpoint /new και μας επιστρεφει
  //το modify.ejs . Στο modify αν βαλουμε τα στοιχεια και πατησουμε create post οδηγουμαστε στο endpoint "/api/posts"

});





//Κανουμε handle τα post requests τα οποια γινονται στο endpoint "/api/AddNewPost" .
app.post("/api/AddNewPost", async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:4000/AddNewPostApi`,req.body);//Κανουμε ενα post request στο endpoint http://localhost:4000/posts για να προσθεσουμε ενα post στον πινακα.
    const JsObj = response.data; //Αποθηκευουμε τα δεδομενα του πινακα που μας επιστρεφονται απο το API στο αντικειμενο JsObj.
    //console.log(JsObj);
    res.redirect("/");//Κανουμε redirect στο endpoint "/" ωστε να σταλουν τα δεδομενα του πινακα στο index.ejs.

  } catch (error) {
    res.status(500).json({ message: "Error creating post" });//Σε περιπτωση error εμφανιζουμε ενα json μηνυμα.
  }
});





//Πατωντας το κουμπι edit κανουμε ενα get request στο endpoint "/edit/:id" ωστε να παρουμε ενα post αντικειμενο με συγκεκριμενο id.
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:4000/returnPostApi/${req.params.id}`); //Κανουμε ενα get request στο API στο endpoint returnPostApi/${req.params.id}.
    const JsObj = response.data ; //Μας επιστρεφεται ενα ενα JsObj με τις πληροφοριες που μας επεστρεψε το API.
    //console.log(response.data);
    res.render("modify.ejs", {//Περναμε τις πληροφοριες που λαβαμε στο αρχειο modify.ejs ωστε να μπορει να τις επεξεργαστει ο χρηστης.
      heading: "Edit Post",
      submit: "Update Post",
      post: JsObj,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});





//Κανουμε handle το post request του χρηστη στο endpoint "/api/posts/:id" που σκοπο εχει την επεξεργασια ενος συγκεκριμενου post.
app.post("/api/posts/:id", async (req, res) => {
  
  try {
    
    const response = await axios.patch(`http://localhost:4000/PatchPostApi/${req.params.id}`,req.body); //Κανουμε patch request στο API στελνοντας του την παραμετρο και το body του post αντικειμενου.
    const JsObj = response.data; //Αποθηκευουμε τα δεδομενα του πινακα που μας επιστρεφονται απο το API στο αντικειμενο JsObj.
    res.redirect("/");//Κανουμε redirect με σκοπο την εκτυπωση του πινακα posts.
    
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});




// Κανουμε hadle το get request στο endopoint "/api/posts/delete/:id" το οποιο γινεται οταν πατηθει το κουμπι delete.
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`http://localhost:4000/DeletePostApi/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});





app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
