import { csrfFetch } from "./csrf"

//types
const GET_GROUPS="groups/GET_GROUPS"
const CREATE_GROUP="groups/CREATE_GROUP"
const GET_DETAILS="groups/GET_DETAILS"
const REMOVE_GROUP="groups/REMOVE_GROUP"

//actions


const getGroups=groups=>({
    type:GET_GROUPS,
    groups
})

const createGroup=group=>({
    type:CREATE_GROUP,
    group
})

const getDatails=group=>({
    type:GET_DETAILS,
    group
})

const removeGroup=groupId=>({
    type:REMOVE_GROUP,
    groupId
})


export const getAllGroups=()=>async(dispatch)=>{
    const response=await fetch("/api/groups")
    if(response.ok){
        const groups=await response.json()
        dispatch (getGroups(groups.Groups))
    }
}

export const createNewGroup=(data)=>async(dispatch)=>{
    const response=await csrfFetch("/api/groups", {
        method:"POST",
        headers:{"Content-Type":"applicatin-json"},
        body:JSON.stringify(data)
    })

    if(response.ok){
        const group = await response.json()
        const image = {
            url:data.preview,
            groupId:group.id,
            preview:true
        }

        const fetchImage =await csrfFetch(`api/groups/${group.id}/images`,{
            method:"POST",
            headers:{"Content-Type":"applicatin-json"},
            body:JSON.stringify(image)
        })
        dispatch(createGroup(group))
    }
}

export const getGroupDetails=(groupId)=>async(dispatch)=>{
    const response= await fetch(`/api/groups/${groupId}`)

    if(response.ok){
        const group=await response.json()
        dispatch(getDatails(group))
    }
}
