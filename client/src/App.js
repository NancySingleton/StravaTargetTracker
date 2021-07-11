import React, { useState, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState('');
  const [activities, setActivities] = useState({});
  const tempCodeRef = useRef();

  const getToken = () => {
    axios
      .get('auth/token')
      .then((response) => {
        console.log(response.data);
        setToken(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createToken = () => {
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
  };

  const refreshActivities = () => {
    axios
      .get('/activities')
      .then((response) => {
        console.log(response.data);
        setActivities(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <input ref={tempCodeRef} type="text" />
      <button onClick={createToken}>Enter Temp Code</button>
      <button onClick={refreshActivities}>Refresh Activities</button>
      {JSON.stringify(activities)}
    </>
  );
};

export default App;
