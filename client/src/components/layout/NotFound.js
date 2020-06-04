import React, { Fragment } from 'react';

const NotFound = () => {
  return (
    <Fragment>
      <h1 className='x-large text-primary'>
        <i className='fas fa-exclamation-trianngle'></i>Page Not found
      </h1>
      <p className='large'>Sorry, this page does not exists</p>
    </Fragment>
  );
};

export default NotFound;
