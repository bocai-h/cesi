import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";

import api from "services/api";

class ProcessLog extends React.Component {
  state = {
    modal: false,
    dropdownOpen: false,
    logs: null
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
    if (this.interval > 0) {
      clearInterval(this.interval)
    }
  };

  buttonToggle = () => this.setState({"dropdownOpen": !this.state.dropdownOpen});

  showLogs = () => {
    const {node, process} = this.props;
    const processUniqueName = `${process.group}:${process.name}`;
    api
      .processes
      .process
      .log(node.general.name, processUniqueName)
      .then(data => {
        console.log(data);
        this.setState({logs: data.logs});
        this.toggle();
      });
  };

  getLogsInterval = () => {
    const {node, process} = this.props;
    const processUniqueName = `${process.group}:${process.name}`;
    const getLog = (mthis) => () => {
      api
        .processes
        .process
        .log(node.general.name, processUniqueName)
        .then(data => {
          console.log(data);
          mthis.setState({logs: data.logs});
          // this.toggle();
        });
    }
    this.interval = setInterval(getLog(this), 3000);
    this.setState({modal: true});
  }

  render() {
    const {node, process} = this.props;
    const dropdownOpen = this.state.dropdownOpen
    return (
      <React.Fragment>
        {/* <Button color="info" onClick={this.getLogsInterval}>
          Log
        </Button>{" "} */}
        <ButtonDropdown isOpen={dropdownOpen} toggle={this.buttonToggle}>
          <DropdownToggle caret color="info">
            Log
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.getLogsInterval}>StdOut</DropdownItem>
            <DropdownItem divider/>
            <DropdownItem>StdErr</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Node: {node.general.name}
            | Process: {process.name}
          </ModalHeader>
          <ModalBody
            style={{
            'max-height': 'calc(100vh - 210px)',
            'overflow-y': 'auto'
          }}>
            {this.state.logs && (
              <React.Fragment>
                <strong>Stdout</strong>
                {this
                  .state
                  .logs
                  .stdout
                  .map(log => (
                    <p key={log}>{log}</p>
                  ))}
                <br/>
                <strong>Stderr</strong>
                {this
                  .state
                  .logs
                  .stderr
                  .map(log => (
                    <p key={log}>{log}</p>
                  ))}
              </React.Fragment>
            )}
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ProcessLog