import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, where } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc, query } from "firebase/firestore";

import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "AIzaSyAj4uoJj2yegyJaEiJ4zIcieCW2afH4B-A",
  authDomain: "chat-app-gs-1e2c6.firebaseapp.com",
  projectId: "chat-app-gs-1e2c6",
  storageBucket: "chat-app-gs-1e2c6.firebasestorage.app",
  messagingSenderId: "20155606327",
  appId: "1:20155606327:web:ab5a5b956706d0499c26b2"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There i am using chat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })
    } catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));

    }
}
const login = async(email,password) => {
    try{
        await signInWithEmailAndPassword(auth,email,password);

    } catch (error){ 
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));

    }
}
const logout = async () => {
    try{
        await signOut(auth)
    } catch(error)
{
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));

}
};   

const resetPass = async (email) =>{
     if (!email) {
        toast.error("Enter your mail");
        return null;
     }
     try {
        const userRef = collection(db,'users');
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email Sent")
        }
        else{
            toast.error("Email doesn't exists")
        }
     } catch (error) {
        console.error(error);
        toast.error(error.message);
        
     }
}

export {signup,login,logout,auth,db,resetPass}