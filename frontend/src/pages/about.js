import React from 'react';
import Layout from '@theme/Layout';

function AboutPage() {
  return (
    <Layout title="About Us" description="Learn about Aziz Restaurant">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>About Aziz Restaurant</h1>

            <div className="margin-vert--lg">
              <h2>Our Story</h2>
              <p>
                Founded in 2010, Aziz Restaurant began as a small family-owned eatery with a passion for authentic flavors
                and exceptional hospitality. What started as a dream has grown into a beloved destination for food lovers
                seeking memorable dining experiences.
              </p>

              <p>
                Our commitment to quality ingredients, traditional cooking techniques, and warm service has earned us
                recognition as one of the top restaurants in the city. We source our ingredients locally whenever possible
                and prepare each dish with care and attention to detail.
              </p>
            </div>

            <div className="margin-vert--lg">
              <h2>Our Mission</h2>
              <p>
                To create unforgettable dining experiences by combining exceptional cuisine with outstanding service,
                fostering lasting relationships with our guests and contributing positively to our community.
              </p>
            </div>

            <div className="margin-vert--lg">
              <h2>Our Values</h2>
              <ul>
                <li><strong>Quality:</strong> Using only the finest ingredients and time-honored preparation methods</li>
                <li><strong>Service:</strong> Providing warm, attentive service that makes every guest feel welcome</li>
                <li><strong>Community:</strong> Supporting local farmers and suppliers while giving back to our neighborhood</li>
                <li><strong>Innovation:</strong> Balancing tradition with creativity to offer exciting new experiences</li>
              </ul>
            </div>

            <div className="margin-vert--lg">
              <h2>Visit Us</h2>
              <p>
                <strong>Address:</strong> 123 Culinary Avenue, Food District<br/>
                <strong>Hours:</strong> Monday - Thursday: 11:00 AM - 10:00 PM<br/>
                Friday - Saturday: 11:00 AM - 11:00 PM<br/>
                Sunday: 10:00 AM - 9:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AboutPage;