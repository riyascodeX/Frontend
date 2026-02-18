
import './chatpage.css'
import Newprompt from '../../components/newprompt/Newprompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
const Chatpage = () => {
  
const path=useLocation().pathname
const chatId=path.split("/").pop()

const { isPending, error, data } = useQuery({
    queryKey: ['chat',chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
        {credentials:"include" }).then((res) =>
        res.json(),
      ),
  })
console.log(data)

  return (
    <div className="chatpage">
     <div className="wrapper">
      <div className="chat">
        
        
        
        {isPending?
        "Loading.."
        :error?"Error loading chat data"
        :data?.history?.map((message,i)=>(
          <div className={message.role==="user"?"message user":"message assistant"} key={i}>
            <Markdown>{message.parts[0].text}</Markdown>
          </div>
          ))}
        
       
        <Newprompt />
        
       </div>
     </div>
    </div>
  )
}

export default Chatpage