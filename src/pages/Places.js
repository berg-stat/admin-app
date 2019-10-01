import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import PlacesTable from '../components/PlacesTable';


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

function Places(props) {
  const { classes } = props;
  return (
    <main className={classes.content}>
      <div className={classes.toolbar}>
        <PlacesTable/>
      </div>
    </main>
  );
}

Places.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Places);
