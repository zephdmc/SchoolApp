import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCalendar, FiList, FiGrid } from 'react-icons/fi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useMediaQuery } from 'react-responsive';

const StudentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('month');
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/academic/api/calendar/admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const formattedEvents = res.data.map(event => ({
        id: event._id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        color: event.colorCode,
        extendedProps: {
          description: event.description,
          type: event.eventType,
          className: event.specificClass?.name || null
        }
      }));
      setEvents(formattedEvents);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    toast.info(
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{info.event.title}</h3>
        <p><span className="font-semibold">Type:</span> {info.event.extendedProps.type}</p>
        <p><span className="font-semibold">Time:</span> {info.event.start.toLocaleString()} - {info.event.end?.toLocaleString() || 'N/A'}</p>
        {info.event.extendedProps.description && (
          <p><span className="font-semibold">Details:</span> {info.event.extendedProps.description}</p>
        )}
        {info.event.extendedProps.className && (
          <p><span className="font-semibold">Class:</span> {info.event.extendedProps.className}</p>
        )}
      </div>,
      {
        position: isMobile ? 'top-center' : 'top-right',
        autoClose: 8000
      }
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 font-sans">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <FiCalendar className="text-blue-600 text-2xl sm:text-3xl" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-poppins">
              School Calendar
            </h1>
          </div>
          
          {/* View Toggle */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg self-start">
            <button
              onClick={() => setView('month')}
              className={`flex items-center px-3 py-2 rounded-md transition-all ${view === 'month' ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
            >
              <FiGrid className="mr-2" />
              {!isMobile && 'Month'}
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center px-3 py-2 rounded-md transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
            >
              <FiList className="mr-2" />
              {!isMobile && 'List'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Calendar/List View */}
        {!loading && (
          view === 'month' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={isMobile ? 'timeGridDay' : isTablet ? 'timeGridWeek' : 'dayGridMonth'}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: isMobile ? '' : 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                height={isMobile ? 'auto' : '650px'}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                dayHeaderFormat={{
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  omitCommas: true
                }}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {events.length > 0 ? (
                  events.map(event => (
                    <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleEventClick({ event })}>
                      <div className="flex items-start space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" 
                          style={{ backgroundColor: event.color }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(event.start).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {event.end && (
                              <>
                                {' - '}
                                {new Date(event.end).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </>
                            )}
                          </p>
                          {event.extendedProps.description && (
                            <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                              {event.extendedProps.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No upcoming events found
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <div className="fc-event-main-frame p-1">
      <div className="fc-event-title-container">
        <div className="fc-event-title text-sm font-medium px-1 py-0.5 rounded truncate">
          {eventInfo.event.title}
        </div>
      </div>
    </div>
  );
}

export default StudentCalendar;