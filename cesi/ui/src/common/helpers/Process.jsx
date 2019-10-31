import React from "react";
import {
    Badge,
    Button
  } from "reactstrap";

import ProcessLog from "common/helpers/ProcessLog"
import api from "services/api";

const Process = ({ node, process, refresh }) => {
    const handleProcess = action => {
      const nodeName = node.general.name;
      const processUniqueName = `${process.group}:${process.name}`;
      api.processes.process[action](nodeName, processUniqueName).then(data => {
        console.log(data);
        refresh();
      });
    };
  
    const stateColor = stateName => {
      let color = ""
      switch(stateName) {
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
        case "EXITED", "FATAL":
          color = "danger"
          break;
        case "UNKNOWN":
          color = "dark"
          break;
      } 
      return color
    }
  
    return (
      <React.Fragment>
        <tr key={process.name}>
          <td>{process.name}</td>
          <td>{process.group}</td>
          <td>{process.pid}</td>
          <td>{process.uptime}</td>
          <td>
            <Badge pill color={stateColor(process.statename)}>{process.statename}</Badge>
          </td>
          <td>
            <Button color="success" onClick={() => handleProcess("start")}>
              Start
            </Button>{" "}
            <Button color="danger" onClick={() => handleProcess("stop")}>
              Stop
            </Button>{" "}
            <Button color="warning" onClick={() => handleProcess("restart")}>
              Restart
            </Button>{" "}
            <ProcessLog process={process} node={node} />
          </td>
        </tr>
      </React.Fragment>
    );
  };

  export default Process;