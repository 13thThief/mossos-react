import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Spinner from '@components/common/Spinner';

const Loader = ({ show }) => {
  const [node] = useState(document.createElement('div'));
  const loader = document.querySelector('#loader');

  useEffect(() => {
    loader.appendChild(node).classList.add('message');
  }, [loader, node]);

  useEffect(() => {
    if (show) {
      loader.classList.remove('hide');
      document.body.classList.add('loader-open');
    } else {
      loader.classList.add('hide');
      document.body.classList.remove('loader-open');
    }
  }, [loader, show]);

  return ReactDOM.createPortal(<Spinner />, node);
};

export default Loader;
