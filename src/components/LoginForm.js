import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function LoginForm(props) {
  const { classes } = props;
  return (
    <form className={classes.form}>
      <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor="email">Email or username</InputLabel>
        <Input id="emailOrUsername" name="emailOrUsername" onChange={(e) => props.onChange(e)}/>
      </FormControl>
      <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input name="password" type="password" id="password" onChange={(e) => props.onChange(e)}/>
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={(e) => {
          e.preventDefault();
          props.onClick();
        }}
      >
        Login
      </Button>
    </form>
  )
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
