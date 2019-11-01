import React from "react";
import {Card, CardTitle, Badge, Button, Spinner, Table} from "reactstrap";
import Process from "common/helpers/Process"
import PropTypes from "prop-types";

import api from "services/api";

class Processes extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    filterFunc: PropTypes.func
  };
  static defaultProps = {
    filterFunc: () => true
  };

  state = {
    handling: false
  };

  finishedRefresh = () => {
    this.setState({handling: false})
  }

  handleAllProcess = action => {
    const nodeName = this.props.node.general.name;
    this.setState({handling: true})
    api
      .nodes
      .allProcesses[action](nodeName)
      .then(() => {
        console.log("Updating nodes for single node action.");
        this
          .props
          .refresh()
          .then(data => {
            this.finishedRefresh()
          });
      });
  };

  render() {
    const {node, filterFunc, groupColumn} = this.props;
    const handling = this.state.handling;
    return (
      <React.Fragment>
        <Card body>
          <CardTitle>
            Processes for {node.general.name}{" "}
            <Badge color="secondary">{node.processes.length}</Badge>{" "}
            <Button color="success" onClick={() => this.handleAllProcess("start")}>
              Start All
            </Button>{" "}
            <Button color="danger" onClick={() => this.handleAllProcess("stop")}>
              Stop All
            </Button>{" "}
            <Button color="warning" onClick={() => this.handleAllProcess("restart")}>
              Restart All
            </Button>{" "}
          </CardTitle>
          {
             handling ? <Spinner color="primary"  style={{ width: '3rem', height: '3rem' }} />:<div></div>
          }
          {node.processes.length !== 0 && !handling
            ? (
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    {
                      groupColumn ? <th>Group</th> : <th style={{"display": "none"}} ></th>
                    }
                    <th>Pid</th>
                    <th>Uptime</th>
                    <th>State</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {node
                    .processes
                    .filter(filterFunc)
                    .map(process => (<Process
                      key={`${node.name}:${process.name}`}
                      node={node}
                      process={process}
                      groupColumn = {true}
                      refresh={this.props.refresh}/>))}
                </tbody>
              </Table>
            )
            : (
              <p>No processes configured.</p>
            )}
        </Card>
        <br/>
      </React.Fragment>
    );
  }
}

export default Processes;
