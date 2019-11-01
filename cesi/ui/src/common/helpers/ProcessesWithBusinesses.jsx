import React from "react";
import {Card, CardTitle, Badge, Button, Table, Spinner} from "reactstrap";
import Process from "common/helpers/Process"
import PropTypes from "prop-types";
import api from "services/api";

class ProcessesWithBusinesses extends React.Component {
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

  handleAllProcess = (action, processes) => {
    const nodeName = this.props.node.general.name;
    const processNames = processes.map(process => (process.name))
    console.log(processNames)
    this.setState({handling: true})
    api
      .nodes
      .batchProcesses[action](nodeName, processNames)
      .then(() => {
        console.log("Updating nodes for single node action.");
        this
          .props
          .refresh().then(data => {
            this.finishedRefresh()
          });
      });
  };

  render() {
    const {node, bussinesses, groupColumn, filterFunc} = this.props;
    const handling = this.state.handling;
    const showProcesses = node
      .processes
      .filter(process => {
        if (bussinesses.indexOf(process.group) > -1) {
          return process
        }
      })
    return (
      <React.Fragment>
        <Card body>
          <CardTitle>
            Processes for {node.general.name}{" "}{bussinesses.join(" | ")} {" "}
            <Badge color="secondary">{showProcesses.length}</Badge>{" "}
            <Button
              color="success"
              onClick={() => this.handleAllProcess("start", showProcesses)}>
              Start All
            </Button>{" "}
            <Button
              color="danger"
              onClick={() => this.handleAllProcess("stop", showProcesses)}>
              Stop All
            </Button>{" "}
            <Button
              color="warning"
              onClick={() => this.handleAllProcess("restart", showProcesses)}>
              Restart All
            </Button>{" "}
          </CardTitle>
          {
             handling ? <Spinner color="primary"  style={{ width: '3rem', height: '3rem' }} />:<div></div>
          }
          {showProcesses.length !== 0 && !handling
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
                  {showProcesses
                    .filter(filterFunc)
                    .map(process => (<Process
                      key={`${node.name}:${process.name}`}
                      node={node}
                      process={process}
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

export default ProcessesWithBusinesses;
