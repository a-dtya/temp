"use client"
 declare global {
    interface Window {
        recaptchaVerifier:any;
    }
}
import {useState, useEffect} from "react"
import {getAuth, RecaptchaVerifier,signInWithPhoneNumber} from "firebase/auth"
import {app} from '../config.js'
import {useRouter} from "next/navigation"

export default function Login(){
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp,setOtp] = useState('')
  const [confirmationRes, setConfirmationRes]=useState<any | null>(null)
  const [otpSent,setOtpSent] = useState(false)

  const auth = getAuth()
  const router = useRouter()
 
  useEffect(()=>{
    let recaptchaVerifier = window.recaptchaVerifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth,"recaptcha-container",{
      'size': 'normal',
      'callback': (response:any) => {

      },
      'expired-callback': () => {

      }
    })
  }, [auth])


  const handlePhoneNumberChange = (e:any)=>{
    setPhoneNumber(e.target.value)
  }
  const handleOtpChange = (e:any)=>{
    setOtp(e.target.value)
  }

  const handleSentOtp = async()=>{
    try{
      const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g,'')}`
      const confirmation = await signInWithPhoneNumber(auth,formattedPhoneNumber,window.recaptchaVerifier)
      setConfirmationRes(confirmation)
      setOtpSent(true)
      setPhoneNumber('')
      alert("OTP has been sent successfully")
    }catch (error){
      console.error(error)
    }
  }

  const handleOtpSubmit = async()=>{
    try{
      await confirmationRes.confirm(otp)
      setOtp('')
      router.push("/dashboard")
    }catch(error){
      console.error(error)
    }
  }
  return(
    <div>
      {!otpSent ? (
        <div id="recaptcha-container"></div>
      ):null}
      <input type="text" value={otpSent ? otp: phoneNumber} onChange={otpSent ? handleOtpChange : handlePhoneNumberChange} placeholder="Enter phone number" className="border border-gray-500 p-2 rounded-md"/>
      <button
      onClick={otpSent ? handleOtpSubmit : handleSentOtp} className={`bg-${otpSent ? 'green': 'blue'}-500 text-white p-2 rounded-md m-2`} style={{backgroundColor: otpSent ? 'green': 'blue'}}>{
      otpSent ? "Submit OTP" : "Send OTP"}</button>

    </div>
  )
}




