import { csrfFetch } from "./csrf";

//types
const GET_EVENTS = "/events/GET_EVENTS";
const GET_DETAILS = "/events/GET_DETAILS";
const CREATE_EVENT = "/events/CREATE_EVENT";
const REMOVE_EVENT = "/events/REMOVE_EVENT";

//actions

const getEvents = (events) => {
  return {
    type: GET_EVENTS,
    events,
  };
};

const getDetails = (event) => {
  return {
    type: GET_DETAILS,
    event,
  };
};

const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event,
  };
};

const deleteEvent = (id) => {
  return {
    type: REMOVE_EVENT,
    id,
  };
};

export const getAllEvents = () => async (dispatch) => {
  const response = await fetch("/api/events");
  if (response.ok) {
    const events = await response.json();
    dispatch(getEvents(events.Events));
  }
};

export const getEventsForGroup = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);
  if (response.ok) {
    const events = await response.json();
  
    dispatch(getEvents(events.Events));
  }
};

export const getEventById = (id) => async (dispatch) => {
  const response = await fetch(`/api/events/${id}`);
  if (response.ok) {
    const event = await response.json();
    dispatch(getDetails(event));
  }
};

export const createEventByGroupId = (id, data) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${id}/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const event = await response.json();
    const img = { url: data.preview, preview: true, id: event.id };
    await csrfFetch(`/api/events/${event.id}/images`, {
      method: "POST",
      body: JSON.stringify(img),
    });

    dispatch(createEvent(event));
    return event;
  }
};

export const deleteEventById = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const event = await response.json();
    dispatch(deleteEvent(id));
  }
};

const eventReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_EVENTS:
      const newState = action.events.reduce((acc, current) => {
        acc[current.id] = current;
        return acc;
      }, {});
      return newState;

    case GET_DETAILS:
       
      return { ...state, details: action.event };

    case CREATE_EVENT:
      return { ...state, [action.event.id]: action.event };

    case REMOVE_EVENT:
      const stateForDelete = { ...state };
      delete stateForDelete[+action.id];
      return stateForDelete;
    default:
      return state;
  }
};

export default eventReducer;
