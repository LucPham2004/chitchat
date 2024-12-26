import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-blue-500 text-white text-3xl font-bold">
        Hello World!
    </div>
    </>
  )
}

export default App
