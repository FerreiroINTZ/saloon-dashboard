import Dashboard from "../dashboard/dashboard.js"
import LoguinError from "../loguinError/loguinError.js"

export default async function page({params, searchParams, children}) {

    const {user} = await params
    const {token} = await searchParams
  
    const response = await fetch(`http://localhost:3001/get/${user}?token=${token}`)
    console.log(response.status)
    const {acesso} = await response.json()
  
    console.log(acesso)

    if(!acesso){
        return (<LoguinError />)
    }
  
    return (
      <Dashboard />
    );
  }
  