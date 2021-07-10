import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const tempCodeRef = useRef();

  function getToken() {
    axios
      .get('auth/token')
      .then(function (response) {
        console.log(response.data);
        setToken(response.data);
      })
      .catch(function (error) {
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
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    tempCodeRef.current.value = null;
  }

  return (
    <>
      <div>Hi</div>
      <input ref={tempCodeRef} type="text" />
      <button onClick={createToken}>Enter Temp Code</button>
      <button onClick={getToken}>Get Token</button>
      <div>{token}</div>
    </>
  );
}

export default App;
