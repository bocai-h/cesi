import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";

import ProcessesWithBusinessAndServers from "common/helpers/ProcessesWithBusinessAndServers";
import AllBusinesses from "common/helpers/AllBusinesses";
import BusinessNodes from "scenes/nodes/components/BusinessNodes";

class NodesPage extends Component {
  state = {
    bussinessesCheck: "",
    serversChecks: []
  };

  handleServersInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (value) {
        this.setState(prevState => ({
            serversChecks: prevState.serversChecks.concat([name])
        }));
      } else {
        this.setState(prevState => ({
            serversChecks: prevState.serversChecks.filter(element => element !== name)
        }));
      }
  };

  handleBusinessesInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (value) {
      this.setState(prevState => ({
        bussinessesCheck: name,
        serversChecks: []
      }));
    }
  };

  componentDidMount() {
    this.props.refreshNodes();
  }

  render() {
    const { bussinessesCheck, serversChecks } = this.state;
    const { nodes, refreshNodes } = this.props;

    return (
      <Container fluid>
        <Row>
        <Col sm={{ size: "auto" }}>
            <AllBusinesses
                nodes={nodes}
                check={bussinessesCheck}
                onInputChange={this.handleBusinessesInputChange}
            />
          </Col>

          <Col sm={{ size: "auto" }}>
            <BusinessNodes
               business = {bussinessesCheck}
               nodes={this.props.nodes}
               checks={serversChecks}
               onInputChange={this.handleServersInputChange}
            />
          </Col>
          <Col>
            <ProcessesWithBusinessAndServers
                nodes={nodes}
                bussinessCheck={bussinessesCheck}
                nodesChecks={serversChecks}
                refresh={refreshNodes}
            />   
          </Col>

          {/* <Col sm={{ size: "auto" }}>
            <FilterOfNodes
              nodes={this.props.nodes}
              checks={[check]}
              onInputChange={this.handleInputChange}
            />
          </Col>
          <Col sm={{ size: "auto" }}>
            {nodes
              .filter(node => [check].indexOf(node.general.name) >= 0)
              .map(node => (
                <Businesses
                  key={node.general.name}
                  node={node}
                  checks={bussinessesChecks}
                  onInputChange={this.handleBusinessesInputChange}
                />
              ))}
          </Col>
          <Col>
            {nodes
              .filter(node => [check].indexOf(node.general.name) >= 0)
              .map(node => (
                <ProcessesWithBusinesses
                  key={node.general.name}
                  node={node}
                  bussinesses={bussinessesChecks}
                  refresh={refreshNodes}
                />
              ))}
          </Col> */}
        </Row>
      </Container>
    );
  }
}

export default NodesPage;
