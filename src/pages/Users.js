import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import UsersTable from '../components/UsersTable';


const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

function Users(props) {
  const { classes } = props;
  return (
    <main className={classes.content}>
      <div className={classes.toolbar}>
        <UsersTable blocked={props.blocked}/>
      </div>
    </main>
  );
}

Users.propTypes = {
  blocked: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Users);
