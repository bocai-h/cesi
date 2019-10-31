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

class Processes extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    filterFunc: PropTypes.func
  };
  static defaultProps = {
    filterFunc: () => true
  };

  handleAllProcess = action => {
    const nodeName = this.props.node.general.name;
    api.nodes.allProcesses[action](nodeName).then(() => {
      console.log("Updating nodes for single node action.");
      this.props.refresh();
    });
  };

  render() {
    const { node, bussinesses, filterFunc } = this.props;
    return (
      <React.Fragment>
        <Card body>
          <CardTitle>
            Processes for {node.general.name}{" "}
            <Badge color="secondary">{node.processes.length}</Badge>{" "}
            <Button
              color="success"
              onClick={() => this.handleAllProcess("start")}
            >
              Start All
            </Button>{" "}
            <Button
              color="danger"
              onClick={() => this.handleAllProcess("stop")}
            >
              Stop All
            </Button>{" "}
            <Button
              color="warning"
              onClick={() => this.handleAllProcess("restart")}
            >
              Restart All
            </Button>{" "}
          </CardTitle>
          {node.processes.length !== 0 ? (
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
                {node.processes.filter(filterFunc).map(process => (
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

export default Processes;
