import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
      <div class="row">
        <div class="col-md-6 col-md-offset-3">
          <form id="msform">
            <ul id="progressbar">
              <li class="active">Personal Details</li>
              <li>Question one</li>
              <li>Question two</li>
              <li>Question three</li>
              <li>Question four</li>
              <li>Question five</li>
              <li>Question six</li>
              <li>Results</li>
            </ul>

            <div>
              <fieldset>
                <h2 class="fs-title">Personal Details</h2>
                <h3 class="fs-subtitle">Tell us something more about you</h3>
                <input type="text" name="fname" placeholder="First Name" />
                <input type="text" name="lname" placeholder="Last Name" />
                <input type="text" name="phone" placeholder="Phone" />
                <input type="email" name="email" placeholder="Email" />
                <input type="text" name="address" placeholder="Address" />
                <input type="text" name="nationality" placeholder="Nationality" />
                <input type="button" name="next" class="next action-button" value="Next" />
              </fieldset>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;
