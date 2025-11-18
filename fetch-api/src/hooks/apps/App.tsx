import { useEffect } from "react";
import { useFetch } from "../useFetch"

function App() {

  const { users, loading, error, fetchUsers } = useFetch();
  const roles = ["admin", "editor", "viewer"];

  function getRoles():string {
    return roles[Math.floor(Math.random() * roles.length)];
  }

  useEffect(()=>{
    const role = getRoles();
    fetchUsers(role);
  },[]);
  console.log(users);
  
  if(loading){
    return <div>Loading...</div>
  }

  if(error){
    return <div>{error}</div>
  }
  return (
    <div>
      {users.map((e)=>(
        <div key={e._id}>
          <p>{e.name}</p>
          <p>{e.email}</p>
          <p>{e.role}</p>

        </div>
      ))}
    </div>
  )
}

export default App
