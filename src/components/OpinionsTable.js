import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import {
  Block,
  Done,
  DeleteForever,
  ExpandMore,
} from '@material-ui/icons';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core';


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#3f51b5',
    color: theme.palette.common.white,
    fontSize: 19,
    fontWeight: 500,
  },
  body: {
    fontSize: 15,
    fontWeight: 400,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
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
    textAlign: 'justify',
  },
  rightIcon: {
    marginLeft: 5,
  },
});


class OpinionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opinions: [],
      blockedOpinions: [],
    };
  }

  async componentDidMount() {
    const token = `Bearer ${await localStorage.getItem('token')}`;
    try {
      const opinionsResponse = await axios.get('admin/opinions',
        {
          headers: {
            Authorization: token
          }
        });
      const allOpinions = opinionsResponse.data.opinions;
      this.setState({
        opinions: allOpinions.filter((opinion) => !opinion.opinion.isBlocked).sort((a, b) => (new Date(b.opinion.date) - new Date(a.opinion.date))),
        blockedOpinions: allOpinions.filter((opinion) => opinion.opinion.isBlocked).sort((a, b) => (new Date(b.opinion.date) - new Date(a.opinion.date)))
      });
    } catch (error) {
      console.error(error.response.data.message);
    }
  }

  async confirmBlocking(blockedOpinion) {
    if (window.confirm('Are you sure you want to block this opinion?')) {
      const token = `Bearer ${await localStorage.getItem('token')}`;
      try {
        const response = await axios.put(`admin/opinions/${blockedOpinion.opinion._id}/block`,
          {},
          {
            headers: {
              Authorization: token
            }
          });

        if (response.data.message === 'Opinion blocked') {
          const { blockedOpinions } = this.state;
          blockedOpinions.push(blockedOpinion);
          this.setState({
            opinions: this.state.opinions.filter(opinion => opinion.opinion._id !== blockedOpinion.opinion._id),
            blockedOpinions,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async confirmUnblocking(unblockedOpinion) {
    if (window.confirm('Are you sure you want to unblock this opinion?')) {
      const token = `Bearer ${await localStorage.getItem('token')}`;
      try {
        const response = await axios.put(`admin/opinions/${unblockedOpinion.opinion._id}/unblock`,
          {},
          {
            headers: {
              Authorization: token
            }
          });

        if (response.data.message === 'Opinion unblocked') {
          const { opinions } = this.state;
          opinions.push(unblockedOpinion);
          this.setState({
            opinions,
            blockedOpinions: this.state.blockedOpinions.filter(opinion => opinion.opinion._id !== unblockedOpinion.opinion._id)
          });
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    }
  }

  async deleteOpinion(id) {
    if (window.confirm('Are you sure you want to delete this opinion?')) {
      const token = `Bearer ${await localStorage.getItem('token')}`;
      try {
        const response = await axios.delete(`admin/opinions/${id}`,
          {
            headers: {
              Authorization: token
            }
          });
        if (response.data.message === 'Opinion deleted') {
          if (this.props.blocked) {
            this.setState({
              blockedOpinions: this.state.blockedOpinions.filter(opinion => opinion.opinion._id !== id)
            });
          } else {
            this.setState({
              opinions: this.state.opinions.filter(opinion => opinion.opinion._id !== id)
            });
          }
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    }
  }

  reformatDate = (opinionDate) => {
    const date = new Date(opinionDate);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  };

  renderTableHead() {
    return (
      <TableHead>
        <TableRow>
          <CustomTableCell style={{ width: '9%' }}>place</CustomTableCell>
          <CustomTableCell style={{ width: '9%' }} align='center'>author</CustomTableCell>
          <CustomTableCell style={{ width: '20%' }} align='center'>text</CustomTableCell>
          <CustomTableCell style={{ width: '14%' }} align='center'>date</CustomTableCell>
          <CustomTableCell style={{ width: '7%' }} align='center'>likes</CustomTableCell>
          <CustomTableCell style={{ width: '18%' }} align='center'>tags</CustomTableCell>
          <CustomTableCell style={{ width: '11%' }} align='center'>
            {this.props.blocked ? 'unblock' : 'block'}
          </CustomTableCell>
          <CustomTableCell style={{ width: '11%' }} align='center'>
            delete
          </CustomTableCell>
        </TableRow>
      </TableHead>
    );
  }

  renderOpinionsTableRow(opinion, onActionClick) {
    const { classes } = this.props;
    return (
      <TableRow className={classes.row} key={opinion.opinion._id}>
        <CustomTableCell size='small'>
          {opinion.place.name}
        </CustomTableCell>
        <CustomTableCell align='center'>{opinion.author.username}</CustomTableCell>
        <CustomTableCell align='justify'>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore/>}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography style={{ margin: '0 auto', fontSize: '15' }}>opinion text</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                {opinion.opinion.text}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </CustomTableCell>
        <CustomTableCell align='center'>{this.reformatDate(opinion.opinion.date)}</CustomTableCell>
        <CustomTableCell align='center'>{opinion.opinion.likes.length}</CustomTableCell>
        <CustomTableCell align='center'>{opinion.opinion.tags.map(tag => `${tag.name}, `)}</CustomTableCell>
        <CustomTableCell align='center'>
          <Button
            value={opinion.opinion._id}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={onActionClick}
          >
            {!this.props.blocked
              ? <React.Fragment>
                Block
                <Block className={classes.rightIcon}/>
              </React.Fragment>
              : <React.Fragment>
                Unblock
                <Done className={classes.rightIcon}/>
              </React.Fragment>
            }
          </Button>
        </CustomTableCell>
        <CustomTableCell align='center'>
          <Button
            value={opinion.opinion._id}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => this.deleteOpinion(opinion.opinion._id)}
          >
            Delete
            <DeleteForever className={classes.rightIcon}/>
          </Button>
        </CustomTableCell>
      </TableRow>
    );
  }

  renderBlockedOpinionsTableRow(opinion, onActionClick) {
    const { classes } = this.props;
    return (
      <TableRow className={classes.row} key={opinion.opinion._id}>
        <CustomTableCell size='small'>
          {opinion.place.name}
        </CustomTableCell>
        <CustomTableCell align='center'>{opinion.author.username}</CustomTableCell>
        <CustomTableCell align='justify'>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore/>}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography style={{ margin: '0 auto', fontSize: '15' }}>opinion text</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                {opinion.opinion.text}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </CustomTableCell>
        <CustomTableCell align='center'>{this.reformatDate(opinion.opinion.date)}</CustomTableCell>
        <CustomTableCell align='center'>{opinion.opinion.likes.length}</CustomTableCell>
        <CustomTableCell align='center'>{opinion.opinion.tags.map(tag => `${tag.name}, `)}</CustomTableCell>
        <CustomTableCell align='center'>
          <Button
            value={opinion.opinion._id}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={onActionClick}
          >
            {!this.props.blocked
              ? <React.Fragment>
                Block
                <Block className={classes.rightIcon}/>
              </React.Fragment>
              : <React.Fragment>
                Unblock
                <Done className={classes.rightIcon}/>
              </React.Fragment>
            }
          </Button>
        </CustomTableCell>
        <CustomTableCell align='center'>
          <Button
            value={opinion.opinion._id}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => this.deleteOpinion(opinion.opinion._id)}
          >
            Delete
            <DeleteForever className={classes.rightIcon}/>
          </Button>
        </CustomTableCell>
      </TableRow>
    );
  }

  renderEmptyOpinionsTableBody() {
    return (
      <TableRow className={this.props.classes.row}>
        <CustomTableCell>No blocked opinions</CustomTableCell>
      </TableRow>
    );
  }

  renderBlockedOpinions() {
    return this.state.blockedOpinions.map(opinion =>
      this.renderBlockedOpinionsTableRow(opinion, () => this.confirmUnblocking(opinion))
    );
  }

  renderNonBlockedOpinions() {
    return this.state.opinions.map(opinion =>
      this.renderOpinionsTableRow(opinion, () => this.confirmBlocking(opinion))
    );
  }

  renderTableBody() {
    if (!this.state.blockedOpinions && this.props.blocked) {
      return this.renderEmptyOpinionsTableBody();
    } else if (this.props.blocked) {
      return this.renderBlockedOpinions();
    } else {
      return this.renderNonBlockedOpinions();
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
        <Typography variant="h3">{`${this.props.blocked ? 'Blocked' : 'All'} opinions`}</Typography>
        <Paper className={classes.root}>
          <Table className={classes.table} padding='checkbox'>
            {this.renderTableHead()}
            <TableBody>
              {this.renderTableBody()}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  }
}

OpinionsTable.propTypes = {
  blocked: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpinionsTable);
