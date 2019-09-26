import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";

import ProcessesWithBussinesses from "common/helpers/ProcessesWithBussinesses";
import Bussinesses from "common/helpers/Bussinesses";
import FilterOfNodes from "scenes/nodes/components/FilterOfNodes";

class NodesPage extends Component {
  state = {
    check: [],
    bussinessesChecks: []
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (value) {
      this.setState(prevState => ({
        check: name
      }));
    }
  };

  handleBusinessesInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (value) {
      this.setState(prevState => ({
        bussinessesChecks: prevState.bussinessesChecks.concat([name])
      }));
    } else {
      this.setState(prevState => ({
        bussinessesChecks: prevState.bussinessesChecks.filter(element => element !== name)
      }));
    }
  };

  componentDidMount() {
    this.props.refreshNodes();
  }

  render() {
    const { check, bussinessesChecks } = this.state;
    const { nodes, refreshNodes } = this.props;

    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: "auto" }}>
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
                <Bussinesses
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
                <ProcessesWithBussinesses
                  key={node.general.name}
                  node={node}
                  bussinesses={bussinessesChecks}
                  refresh={refreshNodes}
                />
              ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default NodesPage;
