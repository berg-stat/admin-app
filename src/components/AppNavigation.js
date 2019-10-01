import React from 'react';

import Title from './Title';
import ToggleMenu from'./ToggleMenu';


function AppNavigation() {
  return (
      <ToggleMenu>
        <Title/>
      </ToggleMenu>
  );
}

export default AppNavigation;
