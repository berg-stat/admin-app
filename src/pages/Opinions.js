import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import OpinionsTable from '../components/OpinionsTable';


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

function Opinions(props) {
  const { classes } = props;
  return (
    <main className={classes.content}>
      <div className={classes.toolbar}>
        <OpinionsTable mocked={props.mocked} blocked={props.blocked}/>
      </div>
    </main>
  );
}

Opinions.propTypes = {
  mocked: PropTypes.bool,
  blocked: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Opinions);
