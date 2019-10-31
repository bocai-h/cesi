import React from "react";
import {
  Card,
  CardTitle,
  Badge,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
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


  handleAllProcess = (action, processes) => {
    const nodeName = this.props.node.general.name;
    const processNames = processes.map(process=>(process.name))
    console.log(processNames)
    api.nodes.batchProcesses[action](nodeName, processNames).then(() => {
      console.log("Updating nodes for single node action.");
      this.props.refresh();
    });
  };

  render() {
    const { node, bussinesses, filterFunc } = this.props;
    const showProcesses = node.processes.filter(process => {
        if(bussinesses.indexOf(process.group) > -1) {
            return process
        }
    })
    return (
      <React.Fragment>
        <Card body>
          <CardTitle>
            Processes for {node.general.name}{" "}{ bussinesses.join(" | ") } {" "}
            <Badge color="secondary">{showProcesses.length}</Badge>{" "}
            <Button
              color="success"
              onClick={() => this.handleAllProcess("start", showProcesses)}
            >
              Start All
            </Button>{" "}
            <Button
              color="danger"
              onClick={() => this.handleAllProcess("stop", showProcesses)}
            >
              Stop All
            </Button>{" "}
            <Button
              color="warning"
              onClick={() => this.handleAllProcess("restart", showProcesses)}
            >
              Restart All
            </Button>{" "}
          </CardTitle>
          {showProcesses.length !== 0 ? (
            <Table hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Group</th>
                  <th>Pid</th>
                  <th>Uptime</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {showProcesses.filter(filterFunc).map(process => (
                  <Process
                    key={`${node.name}:${process.name}`}
                    node={node}
                    process={process}
                    refresh={this.props.refresh}
                  />
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No processes configured.</p>
          )}
        </Card>
        <br />
      </React.Fragment>
    );
  }
}

export default ProcessesWithBusinesses;
