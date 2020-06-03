import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEdu = ({
  education: {
    school,
    degree,
    location,
    fieldofstudy,
    current,
    to,
    from,
    description,
  },
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      <strong>Location: </strong>
      {location}
    </p>
    <p>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
      {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}{' '}
    </p>
    <p>
      <strong>Degree: </strong>
      {degree}
    </p>
    <p>
      <strong>Field of Study: </strong>
      {fieldofstudy}
    </p>
    <p>
      <strong>Description: </strong>
      {description}
    </p>
  </div>
);

ProfileEdu.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEdu;
