import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import DeleteForever from '@material-ui/icons/DeleteForever';
import {
  Grid,
  Typography,
  Paper,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
} from '@material-ui/core';


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

class PlacesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
    };
  }

  async componentDidMount() {
    const token = `Bearer ${await localStorage.getItem('token')}`;
    try {
      const placesResponse = await axios.get('places/',
        {
          headers: {
            Authorization: token
          }
        });
      const places = placesResponse.data.places;
      this.setState({ places });
    } catch (error) {
      console.error(error.response.data.message);
    }
  }

  async deletePlace(name) {
    if (window.confirm('Are you sure you want to delete this place?')) {
      const token = `Bearer ${await localStorage.getItem('token')}`;
      try {
        const response = await axios.delete(`admin/places/${name}`,
          {
            headers: {
              Authorization: token
            }
          });

        if (response.data.message === 'Place deleted') {
          this.setState({ places: this.state.places.filter(place => place.name !== name) });
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    }
  }

  renderTableHeader() {
    return (
      <TableHead>
        <TableRow>
          <CustomTableCell>name</CustomTableCell>
          <CustomTableCell align='center'>latitude</CustomTableCell>
          <CustomTableCell align='center'>longitude</CustomTableCell>
          <CustomTableCell align='center'>elevation</CustomTableCell>
          <CustomTableCell align='center'>delete</CustomTableCell>
        </TableRow>
      </TableHead>
    );
  }

  renderTableRow(place) {
    const { classes } = this.props;
    return (
      <TableRow className={classes.row} key={place._id}>
        <CustomTableCell component="th" scope="row">
          {place.name}
        </CustomTableCell>
        <CustomTableCell align='center'>{place.coordinates.latitude}</CustomTableCell>
        <CustomTableCell align='center'>{place.coordinates.longitude}</CustomTableCell>
        <CustomTableCell align='center'>{place.coordinates.elevation}</CustomTableCell>
        <CustomTableCell align='center'>
          <Button
            value={place._id}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => this.deletePlace(place.name)}
          >
            Delete place
            <DeleteForever className={classes.rightIcon}/>
          </Button>
        </CustomTableCell>
      </TableRow>
    );
  }

  renderEmptyPlacesList() {
    return (
      <TableRow className={this.props.classes.row}>
        <CustomTableCell>No places</CustomTableCell>
      </TableRow>
    );
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
        <Typography variant="h3">Places</Typography>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            {this.renderTableHeader()}
            <TableBody>
              {
                !this.state.places
                ? this.renderEmptyPlacesList()
                : this.state.places.map(place => this.renderTableRow(place))
              }
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  }
}

PlacesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlacesTable);
