import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AvailabilityCalendar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partySize, setPartySize] = useState(2);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        // Mock API call - in real implementation, this would be an actual API call
        // const response = await fetch(`/api/reservations/availability/slots?date=${selectedDate.toISOString()}&partySize=${partySize}`);
        // const data = await response.json();

        // For demo purposes, return a subset of timeSlots based on day of week
        const dayOfWeek = selectedDate.getDay();
        let availableTimes;

        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
          availableTimes = timeSlots.slice(2, 10); // Limited hours on weekends
        } else {
          availableTimes = timeSlots; // Full hours on weekdays
        }

        setAvailableSlots(availableTimes);

        // Notify parent component of updated availability
        if (onDateSelect) {
          onDateSelect(selectedDate, availableTimes);
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, partySize, onDateSelect]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePartySizeChange = (e) => {
    setPartySize(parseInt(e.target.value));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h3>Check Table Availability</h3>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="partySize" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Number of Guests
        </label>
        <select
          id="partySize"
          value={partySize}
          onChange={handlePartySizeChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'person' : 'people'}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="reservationDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Select Date
        </label>
        <DatePicker
          id="reservationDate"
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      {loading ? (
        <div>Loading available time slots...</div>
      ) : (
        <div>
          <h4>Available Times for {selectedDate.toLocaleDateString()}</h4>

          {availableSlots.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  style={{
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <div>No available time slots for the selected date and party size.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;