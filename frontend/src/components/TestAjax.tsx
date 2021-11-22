import React, {useEffect, useState} from 'react';

function TextAjax() {
  const [result, setResult] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('5000asdadad ');

    fetch('/api/v1/persons')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []);

  return (
    <>
      {/* {error && <p>ERROR!!!</p>}
      <p>{result}</p> */}
    </>
  );
}

export default TextAjax;
