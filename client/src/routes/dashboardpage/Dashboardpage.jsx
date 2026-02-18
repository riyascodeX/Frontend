import { TypeAnimation } from 'react-type-animation'
import { FaCircleArrowUp } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import {useAuth} from '@clerk/clerk-react'
import './dashboardpage.css'


const Dashboardpage = () => {
  const {userId} = useAuth();
  const handlesubmit = async (e) => {
  e.preventDefault();
  const text = e.target.text.value;
  if (!text) return;

      await fetch("http://localhost:5000/api/chats", {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text }),
    });
  };
  return (
   <div className='dashboardpage'>
    <div className="logopage">
     <div className="logo">
      <img src="amclogo2.JPG" alt="" />
      <span>
        <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'How can I assist you today?',
        3000, // wait 1s before replacing precisely and seamelesly
        'What campus information can I assist you with?',
        2000,
        'Looking for courses, admissions, or facilities?',
        2000,
        'Campus assistance, ready when you are...',
        3000
      ]}
      wrapper="span"
      speed={80}
      style={{ fontSize: '2em', display: 'inline-block' }}
      repeat={Infinity}
      cursor={true}
    />
      </span>
      </div>
      <div className="formcontainer">
        <form onSubmit={handlesubmit} >
          <div className="chatbar">
          <span className='plus'><GrAdd /></span>
          <input type="text" name='text' placeholder='Ask me anything...' /></div>
          <button><FaCircleArrowUp /> </button>
        </form>
      </div>
   </div>
   </div>
  )
}
export default Dashboardpage