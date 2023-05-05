import { csrfFetch } from "./csrf";

//types
const GET_GROUPS = "groups/GET_GROUPS";
const CREATE_GROUP = "groups/CREATE_GROUP";
const GET_DETAILS = "groups/GET_DETAILS";
const REMOVE_GROUP = "groups/REMOVE_GROUP";

//actions

const getGroups = (groups) => ({
  type: GET_GROUPS,
  groups,
});

const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

const getDatails = (group) => ({
  type: GET_DETAILS,
  group,
});

const removeGroup = (groupId) => ({
  type: REMOVE_GROUP,
  groupId,
});

export const getAllGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");
  console.log(response)
  if (response.ok) {
    const groups = await response.json();
    dispatch(getGroups(groups.Groups));
  }
};

export const createNewGroup = (data) => async (dispatch) => {
const formData={...data}

delete formData.preview

console.log(formData)
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    // headers: { "Content-Type": "applicatin-json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const group = await response.json();
    const image = {
      url: data.preview,
      groupId: group.id,
      preview: true,
    };
console.log(image)
    const fetchImage = await csrfFetch(`/api/groups/${group.id}/images`, {
      method: "POST",
      // headers: { "Content-Type": "applicatin-json" },
      body: JSON.stringify(image),
    });
    dispatch(createGroup(group));
  }
};

// export const getGroupDetails = (groupId) => async (dispatch) => {
//   const response = await fetch(`/api/groups/${groupId}`);

//   if (response.ok) {
//     const group = await response.json();
//     dispatch(getDatails(group));
//   }
// };

// export const updateGroup = (groupId, data) => async (dispatch) => {
//   const response = await csrfFetch(`/api/groups/${groupId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "applicatin-json" },
//     body: JSON.stringify(data),
//   });

//   if (response.ok) {
//     const group = await response.json();
//     dispatch(updateGroup(group));
//   }
// };

// export const deleteGroup = (groupId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/groups/${groupId}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "applicatin-json" },
//   });
//   if (response.ok) {
//     const group = await response.json();
//     dispatch(removeGroup(groupId));
//   }
// };

const groupReducer = (state = {}, action) => {
   
  switch (action.type) {
    case GET_GROUPS:
      const newState = action.groups.reduce((acc, current) => {
        acc[current.id] = current;
        return acc;
      }, {});
      return newState;
    case CREATE_GROUP:
      return { ...state, [action.group.id]: action.group };

//     case GET_DETAILS:
//       return { ...state, details: action.group };

//     case REMOVE_GROUP:
//       const deleteNewState = { ...state };
//       delete newState.groups[action.groups.groupId];
//       return deleteNewState;
    default:
      return state;
  }
};

export default groupReducer
