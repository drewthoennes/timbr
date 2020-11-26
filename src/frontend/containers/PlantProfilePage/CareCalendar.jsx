import React from 'react';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

class CareCalendar extends React.PureComponent {
  render() {
    const { events } = this.props;

    return (
      <div>
        <h2>Care Calendar</h2>

        <div id="calendar">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends
            events={events}
          />
        </div>
      </div>
    );
  }
}

CareCalendar.propTypes = {
  events: PropTypes.array.isRequired,
};

export default CareCalendar;
