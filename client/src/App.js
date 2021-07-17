import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const App = () => {
  const [token, setToken] = useState('');
  const [data, setData] = useState([]);
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

  const refreshData = () => {
    axios
      .get('/datasets/distance-by-date')
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const state = {
    labels: data.labels,
    datasets: [
      {
        label: 'Distance',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: data.data,
      },
    ],
  };

  class Chart extends React.Component {
    render() {
      return (
        <div>
          <Bar
            data={state}
            options={{
              title: {
                display: true,
                text: 'Distance',
                fontSize: 20,
              },
              legend: {
                display: true,
                position: 'right',
              },
            }}
          />
        </div>
      );
    }
  }

  return (
    <>
      <input ref={tempCodeRef} type="text" />
      <button onClick={createToken}>Enter Temp Code</button>
      <button onClick={refreshData}>Refresh Data</button>
      <Chart />
    </>
  );
};

export default App;
