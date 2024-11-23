import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";


export const AppContext =  createContext();
const AppContextProvider =(props) =>  {
    
    const navigate = useNavigate();
    const [userData,setUserData] = useState(null);
    const [chatData,setChatData] = useState(null);
    const [messagesId,setMessagesId] = useState(null);
    const [messages,setMessages] = useState([]);
    const [chatUser,setChatUser] = useState(null);
    const [ chatVisible,setChatVisible] = useState(false);

    const loadUserData = async(uid) => {
        try {
            const userRef = doc(db,'users',uid);
            const userSnap = await getDoc(userRef);
            const userData= userSnap.data();
            setUserData(userData);
            if (userData.avatat && userData.name) {
                navigate('/chat');
            }
            else{
                navigate('/profile')
            }
            await updateDoc(userRef,{
                lastSeen:Data.now()
            })
            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef,{
                        lastSeen:Data.now()
                    })
                }
            }, 60000);
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        if (userData) {
            const chatRef = doc(db,'chats',userData.id);
            const unSub = onSnapshot (chatRef, async (res) => {
                const chatItems = res.data().chatsData;
                const tempData = [];
                for(const item of chatItems){
                const userRef= doc (db, 'users', item.rId);
                const userSnap = await getDoc (userRef);
                const userData = userSnap.data();
                tempData.push({...item, userData})
                }
                setChatData(tempData.sort((_a,b)=>b.updatedAta.updatedAt))
    })
    return () => {
        unSub();
    }
        }
    },[userData])

    const value = {
        userData,setUserData,
        chatData,setChatData,
         loadUserData,
         messages,setMessages,
         messagesId,setMessagesId,
         chatUser,setChatUser,
         chatVisible,setChatVisible

    }
    return(
        <AppContext.Provider value={value}>
        {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider