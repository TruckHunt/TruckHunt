/* eslint-disable no-unused-expressions */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Row, ListGroup } from 'react-bootstrap';
import { truckListFetchData } from '../actions/truckListActions.js';
import { truckSelectedUpdate } from '../actions/truckSelectedActions.js';
import TruckListItem from './TruckListItem.jsx';

class TruckList extends Component {

  componentWillReceiveProps() {
    // this.props.truckListFetchData('/truckList');
    this.props.truckList;
    // console.log('got trucks for list');
  }

  render() {
    return (
      <Row>
        <Col xs={12} md={8} mdOffset={2} className={'TruckListClass'} >
          <ListGroup >
            {console.log('should be truck arr', this.props.truckList)}
            {this.props.truckList === undefined ? null :
            (this.props.truckList.map((item, i) =>
              <Link to="/truckMenu" key={i} onClick={() => { this.props.truckSelectedUpdate(item); }} >
                <TruckListItem restaurant={item}     />
              </Link>
            ))
          }
          </ListGroup>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    truckList: state.truckList,
    truckSelected: state.truckSelected
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    truckSelectedUpdate: (truck) => dispatch(truckSelectedUpdate(truck)),
    truckListFetchData: (url) => dispatch(truckListFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TruckList);
