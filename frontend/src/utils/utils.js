export const formatDate=(string)=>{
    const eventDate = new Date(string);
  const hours = eventDate.getHours()
  let minutes = eventDate.getMinutes()
  if(minutes<10){
    minutes=`0${minutes}`
  }
  let day =eventDate.getDate()
  let month =eventDate.getMonth()+1
    let year = eventDate.getFullYear()
  const dateOfEvent = `${year}-${month}-${day}`;
  return (
    <p className="event-text">
    {dateOfEvent} &middot; 
    <span> {hours}:{minutes}</span>
  </p>
  )
}