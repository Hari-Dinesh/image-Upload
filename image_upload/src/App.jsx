import './App.css'
import { useState } from 'react'
import axios from 'axios'
function App() {
  const [file,setfile]=useState();
  
  const handlupdate=()=>{
    const formdata=new FormData()
  formdata.append('file',file)
  axios.post('http://localhost:5000/upload',formdata).then(res=>console.log(res)).catch((err)=>{
    console.log(err);
  })
  }
  return (
    <div>
      <input type="file"  onChange={e=>setfile(e.target.files[0])}/>
      <button onClick={handlupdate}>Submit</button>
    </div>
  )
}

export default App
