import React, { Component } from "react";
import { Card, CardTitle, Badge, CustomInput } from "reactstrap";


class Bussinesses extends Component {
  render() {
    const { node, checks, onInputChange } = this.props;
    const bussinesses = node.general.bussinesses
    return (
      <React.Fragment>
        <Card body>
          {bussinesses.map(bussiness=>(
            <CardTitle key={bussiness}>
              <CustomInput
              type="checkbox"
              name={bussiness}
              label={bussiness}
              id={bussiness}
              checked={checks.indexOf(bussiness) >= 0}
              onChange={onInputChange}
              inline
            />
            </CardTitle>
          ))} 
        </Card>
      </React.Fragment>
    );
  }
}

export default Bussinesses;
