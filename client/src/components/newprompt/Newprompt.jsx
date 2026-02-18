
import { FaCircleArrowUp } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import { useEffect, useRef, useState } from 'react'
import './newprompt.css';
import generateResponse from "../../lib/gemini";
import Markdown from 'react-markdown'



const Newprompt = () => {

const [question,setquestion]=useState('')
const [answer,setanswer]=useState('')
const [history, setHistory] = useState([]);





  const endref=useRef(null);
  useEffect(()=>{
    endref.current.scrollIntoView({behavior:'smooth'})
  },[question,answer])


 /* const add = async (text) => {
  setquestion(text)
  const ans = await generateResponse(text);
  setanswer(ans)
  
}; */


const add = async (text) => {
  setquestion(text);

  // store old chat
  setHistory(prev => [...prev, { question: text, answer: "" }]);

  const ans = await generateResponse(text);

  // typing effect
  let i = 0;
  setanswer("");

  const interval = setInterval(() => {
    i++;
    setanswer(prev => prev + ans.charAt(i - 1));

    setHistory(prev => {
      const updated = [...prev];
      updated[updated.length - 1].answer = ans.slice(0, i);
      return updated;
    });

    if (i >= ans.length) clearInterval(interval);
  }, 10);
};





const handlesubmit=async(e)=>{
 e.preventDefault();
 const text=e.target.text.value
 if(!text) return;
 add(text)
 

}

  return (
    <>
   
   {/* {question &&<div className="message user">{question}</div>}
   {answer &&<div className="message "><Markdown>{answer}</Markdown></div>} */}


   {history.map((item, index) => (
     <div className="message user">{item.question}</div>,
     <div className="message"><Markdown>{item.answer}</Markdown></div>
  
))}

    <div className="endchat" ref={endref}></div>
    <div className="formcontain" >
        <form  onSubmit={handlesubmit}>
          <div className="chaticon">
          <span className='plus'><GrAdd /></span>
          <input 
           type="text"
           placeholder='Ask me anything...' 
           required
           name="text"
           autoComplete="off"
           /></div>
          <button type="sumbit"><FaCircleArrowUp /> </button>
        </form>
     </div>
      </>
  )
}

export default Newprompt 

