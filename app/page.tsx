"use client"

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Login  from "./login/page"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {app} from './config'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter()
  const auth = getAuth(app)
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        console.log(user.phoneNumber)
        router.push("/dashboard")
      }
    })
  },[auth,router])
  return (
    <div>
      <Login/>
   </div>
  );
}
