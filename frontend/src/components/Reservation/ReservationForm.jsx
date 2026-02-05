import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { reservationApi } from '../../services/reservationApi';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    reservationDate: new Date(),
    reservationTime: '',
    partySize: 2,
    specialRequests: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleDateChange = async (date) => {
    setFormData({ ...formData, reservationDate: date, reservationTime: '' });

    // Fetch available time slots for the selected date
    setLoading(true);
    try {
      const dateString = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
      const response = await reservationApi.getAvailableTimeSlots(dateString, formData.partySize);

      if (response.success) {
        setAvailableSlots(response.data.availableSlots || []);
      } else {
        setErrors({ general: response.message || 'Failed to load available time slots' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to load available time slots' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePartySizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFormData({ ...formData, partySize: newSize, reservationTime: '' });

    // Fetch new available slots based on party size
    if (formData.reservationDate) {
      handleDateChange(formData.reservationDate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.reservationTime) newErrors.reservationTime = 'Please select a time';
    if (formData.partySize < 1 || formData.partySize > 20) newErrors.partySize = 'Party size must be between 1 and 20';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare reservation data
      const reservationData = {
        ...formData,
        reservationDate: formData.reservationDate.toISOString().split('T')[0], // Format to YYYY-MM-DD
        reservationTime: formData.reservationTime,
        partySize: parseInt(formData.partySize),
        customerId: 'mock-customer-id' // In real app, this would come from auth
      };

      // Call API to create reservation
      const response = await reservationApi.createReservation(reservationData);

      if (response.success) {
        setLoading(false);
        setSuccessMessage(`Reservation confirmed! Confirmation code: ${response.data.confirmationCode || 'RES-123456'}`);
        setFormData({
          reservationDate: new Date(),
          reservationTime: '',
          partySize: 2,
          specialRequests: '',
        });
        setAvailableSlots([]);
      } else {
        setErrors({ general: response.message || 'Failed to create reservation' });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setErrors({ general: error.message || 'Failed to create reservation. Please try again.' });
    }
  };

  return (
    <div className="reservation-form">
      <h2>Make a Reservation</h2>

      {successMessage && (
        <div className="alert alert-success" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="alert alert-danger" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="reservationDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Select Date
          </label>
          <DatePicker
            id="reservationDate"
            selected={formData.reservationDate}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="partySize" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Party Size
          </label>
          <select
            id="partySize"
            name="partySize"
            value={formData.partySize}
            onChange={handlePartySizeChange}
            className="form-control"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
          {errors.partySize && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.partySize}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="reservationTime" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Select Time
          </label>
          <select
            id="reservationTime"
            name="reservationTime"
            value={formData.reservationTime}
            onChange={handleInputChange}
            disabled={availableSlots.length === 0}
            className="form-control"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', opacity: availableSlots.length === 0 ? '0.5' : '1' }}
          >
            <option value="">Choose a time slot</option>
            {availableSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          {errors.reservationTime && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.reservationTime}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="specialRequests" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            rows="3"
            placeholder="Any special requests or requirements..."
            className="form-control"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Processing...' : 'Book Table'}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;