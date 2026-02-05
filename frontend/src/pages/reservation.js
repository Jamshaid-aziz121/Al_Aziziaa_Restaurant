import React, { useState } from 'react';
import Layout from '@theme/Layout';

function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Reservation submitted successfully! We will send you a confirmation email shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: ''
    });
  };

  return (
    <Layout title="Reserve a Table" description="Book your table at Aziz Restaurant">
      <div className="container margin-vert--lg" style={{ backgroundColor: '#fffaf0', minHeight: '100vh' }}>
        <div className="row" style={{ margin: 0, maxWidth: '100%' }}>
          {/* Left Side - Image and Info */}
          <div className="col col--6" style={{
            backgroundColor: '#8b4513',
            color: 'white',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            minHeight: '600px'
          }}>
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              fontSize: '3rem',
              opacity: 0.1,
              transform: 'rotate(-15deg)'
            }}>
              🍽️
            </div>
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '3rem',
              opacity: 0.1,
              transform: 'rotate(15deg)'
            }}>
              🥂
            </div>

            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                fontFamily: "'Georgia', serif",
                color: '#ffd700'
              }}>
                Reserve Your Table
              </h1>

              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.6',
                marginBottom: '2rem',
                opacity: 0.9
              }}>
                Experience culinary excellence in an atmosphere of warmth and sophistication.
                Reserve your table today and enjoy an unforgettable dining experience.
              </p>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Why Reserve With Us?</h3>
                <ul style={{
                  textAlign: 'left',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#ffd700', marginRight: '0.5rem' }}>✓</span>
                    Guaranteed seating at your preferred time
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#ffd700', marginRight: '0.5rem' }}>✓</span>
                    Special occasion accommodations
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#ffd700', marginRight: '0.5rem' }}>✓</span>
                    Priority service and seating
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#ffd700', marginRight: '0.5rem' }}>✓</span>
                    Dietary restriction accommodations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col col--6" style={{
            backgroundColor: 'white',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '600px'
          }}>
            <div style={{
              maxWidth: '400px',
              margin: '0 auto',
              width: '100%'
            }}>
              <h2 style={{
                fontSize: '2rem',
                color: '#8b4513',
                marginBottom: '0.5rem',
                fontFamily: "'Georgia', serif",
                textAlign: 'center'
              }}>
                Make Your Reservation
              </h2>

              <p style={{
                color: '#666',
                marginBottom: '2rem',
                textAlign: 'center',
                fontSize: '1rem'
              }}>
                Fill out the form below to secure your table
              </p>

              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <div className="margin-vert--md">
                  <label htmlFor="name" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0d0c0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      backgroundColor: '#fafafa'
                    }}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    onMouseEnter={(e) => e.target.style.borderColor = '#8b4513'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#e0d0c0'}
                  />
                </div>

                <div className="margin-vert--md">
                  <label htmlFor="email" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0d0c0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      backgroundColor: '#fafafa'
                    }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    onMouseEnter={(e) => e.target.style.borderColor = '#8b4513'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#e0d0c0'}
                  />
                </div>

                <div className="margin-vert--md">
                  <label htmlFor="phone" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0d0c0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      backgroundColor: '#fafafa'
                    }}
                    value={formData.phone}
                    onChange={handleChange}
                    onMouseEnter={(e) => e.target.style.borderColor = '#8b4513'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#e0d0c0'}
                  />
                </div>

                <div className="row" style={{ margin: 0, marginBottom: '1rem' }}>
                  <div className="col col--6" style={{ padding: 0, paddingRight: '0.5rem' }}>
                    <label htmlFor="date" style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e0d0c0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease',
                        backgroundColor: '#fafafa'
                      }}
                      value={formData.date}
                      onChange={handleChange}
                      required
                      onMouseEnter={(e) => e.target.style.borderColor = '#8b4513'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#e0d0c0'}
                    />
                  </div>
                  <div className="col col--6" style={{ padding: 0, paddingLeft: '0.5rem' }}>
                    <label htmlFor="time" style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e0d0c0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease',
                        backgroundColor: '#fafafa'
                      }}
                      value={formData.time}
                      onChange={handleChange}
                      required
                      onMouseEnter={(e) => e.target.style.borderColor = '#8b4513'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#e0d0c0'}
                    />
                  </div>
                </div>

                <div className="margin-vert--md">
                  <label htmlFor="guests" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Number of Guests *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0d0c0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: '#fafafa',
                      transition: 'border-color 0.3s ease'
                    }}
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    onMouseEnter={(e) => e.target.style.borderColor = '#8b4513'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#e0d0c0'}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="margin-vert--md">
                  <label htmlFor="specialRequests" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Special Requests
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0d0c0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      resize: 'vertical',
                      minHeight: '80px',
                      backgroundColor: '#fafafa',
                      transition: 'border-color 0.3s ease'
                    }}
                    value={formData.specialRequests}
                    onChange={handleChange}
                    onMouseEnter={(e) => e.target.style.borderColor = '#8b4513'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#e0d0c0'}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#8b4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    marginTop: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#a0522d';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#8b4513';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Reserve My Table
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 996px) {
          .row {
            flex-direction: column !important;
          }
          .col--6 {
            width: 100% !important;
            max-width: none !important;
          }
          .col--6:nth-child(1) {
            min-height: 400px !important;
          }
          .col--6:nth-child(2) {
            min-height: auto !important;
            padding: 2rem 1rem !important;
          }
        }

        .container {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .form-control:focus {
          outline: none;
          border-color: #8b4513 !important;
        }
      `}</style>
    </Layout>
  );
}

export default ReservationPage;