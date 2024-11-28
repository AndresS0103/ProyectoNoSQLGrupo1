import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios('http://localhost:3002/Usuarios').then(response=>{
      if(response.status === 200) {
        console.log(response.data);
        setData(response.data)
      }
    })
    .catch(err=>{

    })
  }, [])

  return (
    <>
      <p>Bienvenido a la Red Social con NoSQL</p>
      {
        data.length > 0 && data.map((item, index) =>
          <>
            <div key={index}>{item.email}</div> <br />
          </>
        )
      }
    </>
  )
}

export default App
