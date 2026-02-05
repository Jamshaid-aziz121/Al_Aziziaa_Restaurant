import React, { useState } from 'react';
import Layout from '@theme/Layout';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Layout title="Contact Us" description="Get in touch with Aziz Restaurant">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you! Reach out to us with any questions, comments, or concerns.</p>

            <div className="row margin-vert--lg">
              <div className="col col--6">
                <h2>Get in Touch</h2>

                <div className="margin-vert--md">
                  <h4>Address</h4>
                  <p>123 Culinary Avenue<br/>Food District<br/>City, State 12345</p>
                </div>

                <div className="margin-vert--md">
                  <h4>Phone</h4>
                  <p>(555) 123-4567</p>
                </div>

                <div className="margin-vert--md">
                  <h4>Email</h4>
                  <p>info@azizrestaurant.com</p>
                </div>

                <div className="margin-vert--md">
                  <h4>Business Hours</h4>
                  <p>
                    Monday - Thursday: 11:00 AM - 10:00 PM<br/>
                    Friday - Saturday: 11:00 AM - 11:00 PM<br/>
                    Sunday: 10:00 AM - 9:00 PM
                  </p>
                </div>
              </div>

              <div className="col col--6">
                <h2>Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="margin-vert--md">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="margin-vert--md">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="margin-vert--md">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="margin-vert--md">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="button button--primary button--lg">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPage;