import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { getAllGroups } from "../../store/groups"
import Group from "./Group"

    function Groups(){
        const dispatch=useDispatch()
        const groups=useSelector((state)=>{
            return Object.values(state.groups) || []
        })
      
        useEffect(()=>{
dispatch(getAllGroups())
        },[dispatch])
        return (
            <main>
                <div className="container">
                
            <ul>
                {groups.map(item=>{
                    return <Group key={item.id} group={item}/>
                })}
            </ul>


                </div>
          
            </main>
        )
    }
    export default Groups