import React from 'react';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Place,
  Person,
  Block,
  Mms,
  SmsFailed,
} from '@material-ui/icons';


function MenuList(props) {
  return (
    <List>
      <ListItem button onClick={() => props.onClick('Users')}>
        <ListItemIcon>
          <Person/>
        </ListItemIcon>
        <ListItemText inset primary="Users"/>
      </ListItem>

      <ListItem button onClick={() => props.onClick('BlockedUsers')}>
        <ListItemIcon>
          <Block/>
        </ListItemIcon>
        <ListItemText inset primary="Blocked users"/>
      </ListItem>

      <ListItem button onClick={() => props.onClick('Opinions')}>
        <ListItemIcon>
          <Mms/>
        </ListItemIcon>
        <ListItemText inset primary="Opinions"/>
      </ListItem>

      <ListItem button onClick={() => props.onClick('BlockedOpinions')}>
        <ListItemIcon>
          <SmsFailed/>
        </ListItemIcon>
        <ListItemText inset primary="Blocked opinions"/>
      </ListItem>

      <ListItem button onClick={() => props.onClick('Places')}>
        <ListItemIcon>
          <Place/>
        </ListItemIcon>
        <ListItemText inset primary="Places"/>
      </ListItem>
    </List>
  )
}

export default MenuList;
