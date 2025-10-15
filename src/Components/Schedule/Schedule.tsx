import "./Schedule.scss";
import Diamond from "../../SVGS/Diamond";
import Calendar from "../../SVGS/Calendar";

const Schedule = () => {
  return (
    <>
      <div className="schedule-container">
        <div className="schedule">
          <div className="info">
            <div className="title">
              <h2>
                Learn from Experts.
                <br />
                Network for 4 hours.
              </h2>
              <span className="subtitle">
                Wed, Oct 2 | 10:00 AM - 2:00 PM <Calendar />
              </span>
            </div>
            <div className="times">
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Open</p>
                </div>
                <p>10:00 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Illumina Talk</p>
                </div>
                <p>11:30 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>AoPS Talk</p>
                </div>
                <p>1:00 PM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Close</p>
                </div>
                <p>2:00 PM</p>
              </div>
            </div>
          </div>
          <div className="schedule-img">
            <img src="./images/Schedule/ScheduleImg.jpg"></img>
          </div>
        </div>
      </div>

      <div className="schedule-container-mobile">
        <div className="schedule">
          <div className="info">
            <div className="title">
              <h2>
                Learn from Experts.
                <br />
                Network for 4 hours.
              </h2>
              <span className="subtitle">
                Wed, Oct 2 | 10:00 AM - 2:00 PM <Calendar />
              </span>
            </div>
            <div className="schedule-img">
            <img src="./images/Schedule/ScheduleImg.jpg"></img>
          </div>

            <div className="times">
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Open</p>
                </div>
                <p>10:00 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Illumina Talk</p>
                </div>
                <p>11:30 AM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>AoPS Talk</p>
                </div>
                <p>1:00 PM</p>
              </div>
              <div className="item">
                <div className="item-name">
                  <span className="bullet">
                    <Diamond />
                  </span>
                  <p>Doors Close</p>
                </div>
                <p>2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
