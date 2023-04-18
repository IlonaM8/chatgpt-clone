import { useState, useEffect } from "react"


const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage] = useState(null)
  const [prevChats, setPrevChats] = useState([])
  const [currentTitle, setCurrentTittle] = useState(null)


  //new chat clear everything out
  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTittle(null)
  }

  //when you click on each title
  const handleClick = (uniqueTitle) => {
    setCurrentTittle(uniqueTitle)
    setMessage(null)
    setValue("")

  }


const getMessages = async () => {
  const options = {
    method: "POST",
    body: JSON.stringify({
      message: value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
  try {
    const response = await fetch('http://localhost:8000/completions', options)
    const data = await response.json()
    setMessage(data.choices[0].message)



  }catch(error){
    console.error(error)
  }
}

useEffect(() => {
  console.log(currentTitle, value, message)
  if(!currentTitle && value && message){
    setCurrentTittle(value)
  }
  if(currentTitle && value && message){
    setPrevChats(prevChats => (
      [...prevChats, {
            title: currentTitle,
            role: "User",
            content: value
      },
      {
        title: currentTitle,
        role: message.role,
        content: message.content
      }
    ]
    ))
  }


}, [message, currentTitle])

console.log(prevChats)

//show prev chats on the ui
const currentChat = prevChats.filter(prevChats => prevChats.title === currentTitle)
 const uniqueTitles = Array.from(new Set(prevChats.map(prevChats => prevChats.title)))
 console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button className="newChat" onClick={createNewChat}> + New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}

        </ul>
        <nav>
          <p>Made by Ilo</p>
          </nav>
      </section>
      <section className="main">
       {!currentTitle && <h1>ChatGPT clone</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div>
          <div className="buttom-section">
            <div className="input-container">
              <input placeholder="Write your question here..." value={value} onChange={(e) =>setValue(e.target.value)}/>
              <div id="submit" onClick={getMessages}>Send</div>
            </div>
            <p className="info">This is a Chat GPT clone made with the help of Ania Kubow.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App
