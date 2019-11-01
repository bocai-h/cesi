import React from "react";
import {Badge, Button, Spinner} from "reactstrap";

import PropTypes from "prop-types";
import ProcessLog from "common/helpers/ProcessLog"
import api from "services/api";

class Process extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    process: PropTypes.object.isRequired,
    refresh: PropTypes.func
  };

  state = {
    handling: false
  };

  finishedRefresh = () => {
    this.setState({handling: false})
  }
  handleProcess = action => {
    const nodeName = this.props.node.general.name;
    const processUniqueName = `${this.props.process.group}:${this.props.process.name}`;
    this.setState({handling: true})
    api
      .processes
      .process[action](nodeName, processUniqueName)
      .then(data => {
        console.log(data);
        this
          .props
          .refresh()
          .then(data => {
            this.finishedRefresh()
          });
      });
  };

  stateColor = stateName => {
    let color = ""
    switch (stateName) {
      case "RUNNING":
        color = "success"
        break;
      case "STOPPED":
        color = "secondary"
        break;
      case "STARTING":
        color = "info"
        break;
      case "STOPPING":
        color = "warning"
        break;
      case "EXITED",
        "FATAL":
        color = "danger"
        break;
      case "UNKNOWN":
        color = "dark"
        break;
    }
    return color
  }

  render() {
    const {node, process, groupColumn, serverColumn} = this.props;
    console.log(node)
    const handling = this.state.handling;
    return (
      <React.Fragment>
        <tr key={process.name}>
          <td>{process.name}</td>
          {serverColumn
            ? <td>
                {node.general.name}
              </td>
            : <td style={{
              "display": "none"
            }}></td>
}
          {groupColumn
            ? <td>
                {process.group}
              </td>
            : <td style={{
              "display": "none"
            }}></td>
}
          <td>{process.pid}</td>
          <td>{process.uptime}</td>
          <td>
            {handling
              ? <Spinner color="primary"/>
              : <Badge pill color={this.stateColor(process.statename)}>{process.statename}</Badge>
}
          </td>
          <td>
            <Button color="success" onClick={() => this.handleProcess("start")}>
              Start
            </Button>{" "}
            <Button color="danger" onClick={() => this.handleProcess("stop")}>
              Stop
            </Button>{" "}
            <Button color="warning" onClick={() => this.handleProcess("restart")}>
              Restart
            </Button>{" "}
            <ProcessLog process={process} node={node}/>
          </td>
        </tr>
      </React.Fragment>
    )
  }
}
export default Process;