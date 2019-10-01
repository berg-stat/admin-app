import React from 'react';
import Users from '../pages/Users';
import Opinions from '../pages/Opinions';
import Places from '../pages/Places';


function ContentChange(props) {
  return (
    <React.Fragment>
      {(() => {
        switch (props.value) {
          case 'Users':
            return <Users/>;
          case 'BlockedUsers':
            return <Users blocked/>;
          case 'Opinions':
            return <Opinions/>;
          case 'BlockedOpinions':
            return <Opinions blocked/>;
          case 'Places':
            return <Places/>;
          default:
            return null;
        }
      })()}
    </React.Fragment>
  );
}

export default ContentChange;
