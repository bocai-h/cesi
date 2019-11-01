import React from "react";
import {
  Card,
  CardTitle,
  Badge,
  Button,
  Spinner,
  Table
} from "reactstrap";
import PropTypes from "prop-types";
import Process from "common/helpers/Process"
import api from "services/api";

class ProcessesWithBusinessAndServers extends React.Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
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
    this.setState({handling: true})
    processes.map(process => {
      var nodeName = process["node"].general.name
      var processNames = process["processes"].map(process => (process.name))
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
    })
  };

  getShowProcesses = (nodes, business, nodesChecks) => {
    var allProcesses = []
    nodes.map(node => {
      var okProcesses = []
      if (nodesChecks.indexOf(node.general.name) >= 0) {
        var processes = node.processes
        processes.map(process => {
          if (process.group == business) {
            okProcesses.push(process)
          }
        })
      }
      if (okProcesses.length > 0) {
        allProcesses.push({"node": node, "processes": okProcesses})
      }
    })
    return allProcesses
  };

  render() {
    const {nodes, bussinessCheck, nodesChecks, groupColumn, filterFunc} = this.props;
    const handling = this.state.handling;
    const showProcesses = this.getShowProcesses(nodes, bussinessCheck, nodesChecks)
    return (
      <React.Fragment>
        <Card body>
          <CardTitle>
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
                      groupColumn ? <th>Group</th> : (<th style={{"display": "none"}} ></th>)
                    }
                    <th>Server</th>
                    <th>Pid</th>
                    <th>Uptime</th>
                    <th>State</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {showProcesses
                    .filter(filterFunc)
                    .map(processItem => (processItem["processes"].map(process => (<Process
                      key={`${processItem["node"].general.name}:${process.name}`}
                      node={processItem["node"]}
                      groupColumn={false}
                      serverColumn={true}
                      process={process}
                      refresh={this.props.refresh}/>))))}
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

export default ProcessesWithBusinessAndServers;
