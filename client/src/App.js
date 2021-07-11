import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [activities, setActivities] = useState({});
  const tempCodeRef = useRef();

  function getToken() {
    axios
      .get('auth/token')
      .then((response) => {
        console.log(response.data);
        setToken(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function createToken() {
    const tempCode = tempCodeRef.current.value;
    if (tempCode === '') return;

    var body = {
      tempCode: tempCode,
    };

    axios
      .post('auth/token', body)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    tempCodeRef.current.value = null;
  }

  function getActivities() {
    axios
      .get('activity-backlog/getall')
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <input ref={tempCodeRef} type="text" />
      <button onClick={createToken}>Enter Temp Code</button>
      <button onClick={getActivities}>Get Activities</button>
      <div>{JSON.stringify(activities)}</div>
    </>
  );
}

export default App;