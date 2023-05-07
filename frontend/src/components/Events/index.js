import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllEvents } from "../../store/event";
import Event from "./Event";

function Events() {
  const events = useSelector((state) => Object.values(state.events) || []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);
  console.log(events);
  return (
    <main>
      <div className="container">
        <ul>
          {events.map((item) => {
            return <Event key={item.id} event={item} />;
          })}
        </ul>
      </div>
    </main>
  );
}
export default Events;
