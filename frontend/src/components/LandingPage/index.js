import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../OpenModalButton";
import "./LandingPage.css";
function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);
  


  return (
    <main>
      <div className="container">
        <div className="home-title-wrapper">
          <div>
            <h1>
              Meetup—The people platform. Where interests become communities.
            </h1>
            <p>
              Your new community is waiting for you. For 20+ years, millions of
              people have chosen Meetup to make real connections over shared
              interests. Start a group today with a 30-day free trial.
            </p>
          </div>

          <img
            src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
            alt="mainPicture"
          />
        </div>

        <div className="home-subtitle-wrapper">
          <h2>How Meetup works</h2>
          <p>
            Meet new people who share your interests through online and
            in-person events. It’s free to create an account.
          </p>
        </div>

        <div className="home-link-wrapper">
          <NavLink to="/groups" className="link">
            <img
              src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
              alt="see all groups"
            />
            <h4 className="link-title">See all groups </h4>
            <p>
              Do what you love, meet others who love it, find your community.
              The rest is history!
            </p>
          </NavLink>

          <NavLink to="/events" className="link">
            <img
              src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
              alt="find event"
            />
            <h4 className="link-title">Find an event</h4>
            <p>
              Events are happening on just about any topic you can think of,
              from online gaming and photography to yoga and hiking.
            </p>
          </NavLink>
          {sessionUser ? (
            <NavLink to="/groups/new" className="link"> 
            <img
            src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
            alt="start new group"
          />
          <h4 className="link-title">Start a new group</h4>
          <p >
            You don’t have to be an expert to gather people together and explore
            shared interests.
          </p></NavLink>
          ) : (
            <div> <img
            src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
            alt="start new group"
          />
          <h4 className="disabled">Start a new group</h4>
          <p className="disabled">
            You don’t have to be an expert to gather people together and explore
            shared interests.
          </p></div>
          )}
        </div>

        <div className="home-btn-wrapper">
          <OpenModalButton
            buttonText="Join Meetup"
            styleBtn="join-btn"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
