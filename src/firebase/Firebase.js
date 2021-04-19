import app, { firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }

  //Auth API
  createUserWithEmailAndPassword = async (email, password) => {
    return await this.auth.createUserWithEmailAndPassword(email, password);
  };

  signInWithEmailAndPassword = async (email, password) => {
    return await this.auth.signInWithEmailAndPassword(email, password);
  };

  signOut = () => {
    this.auth.signOut();
  };

  passwordReset = (email) => {
    this.auth.sendPasswordResetEmail(email);
  };

  passwordUpdate = (password) => {
    this.auth.currentUser.updatePassword(password);
  };

  //Database API
  users = async () => {
    return await this.db.collection("users");
  };

  user = async (uid) => {
    return await this.db.collection("users").doc(uid);
  };

  getUser = async (uid) => {
    let user = await this.db.collection("users").doc(uid);
    user = await user.get();
    return user.data();
  };

  addPost = async (uid, postid) => {
    const user = await this.user(uid);
    return await user.update({
      posts: firestore.FieldValue.arrayUnion(postid),
    });
  };

  removePost = async (uid, postid) => {
    console.log("Firebase RemovePost!");
    console.log("Post ID: ", postid);

    const user = await this.user(uid);
    const userData = await this.getUser(uid);
    const posts = userData.posts;

    // console.log("User collection: ", user.collection("posts"));
    console.log("Remove Posts: ", firestore.FieldValue.arrayRemove(postid));

    // Delete doc from Firestore
    this.db.collection("flights").doc(postid).delete();

    // const posts = user.d;

    return await user.update({
      posts: posts.filter((post) => post.id !== postid),
    });
  };

  updatePost = async (postid, origin, destination, date) => {
    const postRef = this.db.collection("flights").doc(postid);

    return await postRef
      .update({
        date: date,
        origin: origin,
        destination: destination,
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  votePost = async (postId, userId, postCurrent) => {
    const flight = await this.db.collection("flights").doc(postId);

    return await flight.update({
      votes: firestore.FieldValue.arrayUnion(userId),
      current: postCurrent + 1,
    });
  };

  flights = () => {
    return this.db.collection("flights");
  };
}

export default Firebase;
