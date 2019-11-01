import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ButtonDropdown,
  Spinner,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";

import api from "services/api";

class ProcessLog extends React.Component {
  state = {
    modal: false,
    dropdownOpen: false,
    handling: false,
    logs: null
  };

  finishedRefresh = () => {
    this.setState({handling: false})
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      logs: null
    });
    if (this.stdoutLogInterval > 0) {
      clearInterval(this.stdoutLogInterval)
    }
    if (this.stderrInterval > 0) {
      clearInterval(this.stderrInterval)
    }
  };

  buttonToggle = () => this.setState({
    "dropdownOpen": !this.state.dropdownOpen
  });

  // showLogs = () => {   const {node, process} = this.props;   const
  // processUniqueName = `${process.group}:${process.name}`;   api     .processes
  //    .process     .log(node.general.name, processUniqueName)     .then(data =>
  // {       console.log(data);       this.setState({logs: data.logs});
  // this.toggle();     }); }; getLogsInterval = () => {   const {node, process} =
  // this.props;   const processUniqueName = `${process.group}:${process.name}`;
  // const getLog = (mthis) => () => {     api       .processes       .process
  //   .log(node.general.name, processUniqueName)       .then(data => {
  // console.log(data);         mthis.setState({logs: data.logs});         //
  // this.toggle();       });   }   this.interval = setInterval(getLog(this),
  // 3000);   this.setState({modal: true}); } 获取标准输出日志
  getStdoutLogsInterval = () => {
    this.setState({handling: true})
    const {node, process} = this.props;
    const processUniqueName = `${process.group}:${process.name}`;
    const getLog = (mthis) => () => {
      api
        .processes
        .process
        .stdoutlog(node.general.name, processUniqueName)
        .then(data => {
          console.log(data);
          mthis.setState({logs: data.logs});
          this.finishedRefresh()
        });
    }
    this.stdoutLogInterval = setInterval(getLog(this), 3000);
    this.setState({modal: true});
  }

  // 获取错误日志
  getStderrLogsInterval = () => {
    this.setState({handling: true})
    const {node, process} = this.props;
    const processUniqueName = `${process.group}:${process.name}`;
    const getLog = (mthis) => () => {
      api
        .processes
        .process
        .stderrlog(node.general.name, processUniqueName)
        .then(data => {
          console.log(data);
          mthis.setState({logs: data.logs});
          this.finishedRefresh();
        });
    }
    this.stderrInterval = setInterval(getLog(this), 3000);
    this.setState({modal: true});
  }

  render() {
    const {node, process} = this.props;
    const handling = this.state.handling;
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
            <DropdownItem onClick={this.getStdoutLogsInterval}>StdOut</DropdownItem>
            <DropdownItem divider/>
            <DropdownItem onClick={this.getStderrLogsInterval}>StdErr</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg">
          <ModalHeader toggle={this.toggle}>
            Node: {node.general.name}
            | Process: {process.name}
          </ModalHeader>
          <ModalBody>
            {
              <React.Fragment>
                {
                  handling ? <div style={{marginLeft:"50%",marginRight:"50%"}}><Spinner color="primary"  style={{ width: '3rem', height: '3rem' }} /></div>:<div style={{display: "none"}}></div>
                }
                {
                  this.state.logs ?
                  this.state.logs.data.map(log => (
                    <p key={log}>{log}</p>
                  )): ""}
              </React.Fragment>
            }
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ProcessLog