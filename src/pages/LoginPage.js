import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Avatar,
  CssBaseline,
  Paper,
  Typography,
} from '@material-ui/core';
import LoginForm from '../components/LoginForm';


const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailOrUsername: '',
      password: '',
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.history.replace('/')
    }
  }

  onInputChange = (e) => {
    if (e.target.name === 'emailOrUsername') {
      this.onEmailOrUsernameChange(e.target.value);
    } else {
      this.onPasswordChange(e.target.value);
    }
  };

  onEmailOrUsernameChange = (emailOrUsername) => {
    this.setState({ emailOrUsername });
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };

  onLogin() {
    const { emailOrUsername, password } = this.state;
    axios.post('/users/login',
      {
        emailOrUsername,
        password,
      })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({ emailOrUsername: '', password: '' });
        alert(err.response.data.message);
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline/>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <LoginForm onChange={(e) => this.onInputChange(e)} onClick={() => this.onLogin()}/>
        </Paper>
      </main>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginPage);
