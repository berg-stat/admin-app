import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import {
  withStyles,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Grid,
} from '@material-ui/core';
import Block from '@material-ui/icons/Block';
import Done from '@material-ui/icons/Done';
import DeleteForever from '@material-ui/icons/DeleteForever';


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#3f51b5',
    color: theme.palette.common.white,
    fontSize: 19,
    fontWeight: 500,
  },
  body: {
    fontSize: 16,
    fontWeight: 400,
  },
}))(TableCell);

const styles = theme => ({
  paper: {
    width: '90%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
  row: {
    '&:nth-of-type(even)': {
      backgroundColor: '#dcdff1',
    },
  },
  rightIcon: {
    marginLeft: 5,
  },
});

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      blockedUsers: [],
    };
  }

  async componentDidMount() {
    const token = `Bearer ${await localStorage.getItem('token')}`;
    try {
      if (!localStorage.getItem('email')) {
        const myDataResponse = await axios.get('/users/me',
          {
            headers: {
              Authorization: token
            }
          });
        await localStorage.setItem('email', myDataResponse.data.user.email);
      }
      const usersDataResponse = await axios.get('admin/users',
        {
          headers: {
            Authorization: token
          }
        });
      const blockedUsersDataResponse = await axios.get('admin/users/blocked',
        {
          headers: {
            Authorization: token
          }
        });

      const email = localStorage.getItem('email');
      const users = usersDataResponse.data.users
        .filter((user) => user.email !== email)
        .filter((user) => !user.isBanned);
      const blockedUsers = blockedUsersDataResponse.data.blockedUsers;
      this.setState({ users, blockedUsers });
    } catch (error) {
      console.error(error.response.data.message);
    }
  }

  async confirmBlocking(id) {
    if (window.confirm('Are you sure you want to block this user?')) {
      const token = `Bearer ${await localStorage.getItem('token')}`;
      try {
        const response = await axios.put(`admin/users/${id}/block`,
          {},
          {
            headers: {
              Authorization: token
            }
          });

        if (response.data.message === 'User blocked') {
          const { blockedUsers } = this.state;
          blockedUsers.push(response.data.user);
          this.setState({
            users: this.state.users.filter(user => user._id !== id),
            blockedUsers,
          });
        }

      } catch (error) {
        console.error(error);
      }
    }
  }

  async confirmUnblocking(id) {
    if (window.confirm('Are you sure you want to unblock this user?')) {
      const token = `Bearer ${await localStorage.getItem('token')}`;
      try {
        const response = await axios.put(`admin/users/${id}/unblock`,
          {},
          {
            headers: {
              Authorization: token
            }
          });

        if (response.data.message === 'User unblocked') {
          const { users } = this.state;
          users.push(response.data.user);
          this.setState({
            users,
            blockedUsers: this.state.blockedUsers.filter(user => user._id !== id),
          });
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    }
  }

  async deleteUser(id) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const token = `Bearer ${await localStorage.getItem('token')}`;
      try {
        const response = await axios.delete(`admin/users/${id}`,
          {
            headers: {
              Authorization: token
            }
          });

        if (response.data.message === 'User deleted') {
          if (this.props.blocked) {
            this.setState({
              blockedUsers: this.state.blockedUsers.filter(user => user._id !== response.data.user._id),
            });
          } else {
            this.setState({
              users: this.state.users.filter(user => user._id !== response.data.user._id),
            });
          }
        }

      } catch (error) {
        console.error(error.response.data.message);
      }
    }
  }

  renderTableRow(user, onActionClick) {
    const { classes } = this.props;
    return (
      <TableRow className={classes.row} key={user._id}>
        <CustomTableCell component="th" scope="row">
          {user.username}
        </CustomTableCell>
        <CustomTableCell align='center'>{user.email}</CustomTableCell>
        <CustomTableCell align='center'>
          <Button
            value={user._id}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={onActionClick}
          >
            { !this.props.blocked
              ? <React.Fragment>
                block user
                <Block className={classes.rightIcon}/>
              </React.Fragment>
              : <React.Fragment>
                unblock
                <Done className={classes.rightIcon}/>
              </React.Fragment>
            }
          </Button>
        </CustomTableCell>
        <CustomTableCell align='center'>
          <Button
            value={user._id}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => this.deleteUser(user._id)}
          >
            Delete user
            <DeleteForever className={classes.rightIcon}/>
          </Button>
        </CustomTableCell>
      </TableRow>
    );
  }

  renderEmptyUsersTableBody() {
    return (
      <TableBody>
        <TableRow className={this.props.classes.row}>
          <CustomTableCell>No blocked users</CustomTableCell>
        </TableRow>
      </TableBody>
    );
  }

  renderBlockedUsers() {
    return this.state.blockedUsers.map(user =>
      this.renderTableRow(user, () => this.confirmUnblocking(user._id)));
  }

  renderNonBlockedUsers() {
    return this.state.users.map(user =>
      this.renderTableRow(user, () => this.confirmBlocking(user._id))
    );
  }

  renderTableBody() {
    if (!this.state.blockedUsers && this.props.blocked) {
      return this.renderEmptyUsersTableBody();
    } else if (this.props.blocked) {
      return this.renderBlockedUsers();
    } else {
      return this.renderNonBlockedUsers();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Typography variant="h3">{`${this.props.blocked ? 'Blocked' : 'Registered'} users`}</Typography>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell>username</CustomTableCell>
                <CustomTableCell align='center'>email</CustomTableCell>
                <CustomTableCell align='center'>{this.props.blocked ? 'unblock' : 'block'}</CustomTableCell>
                <CustomTableCell align='center'>delete</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderTableBody()}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  }
}

UsersTable.propTypes = {
  blocked: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UsersTable);
