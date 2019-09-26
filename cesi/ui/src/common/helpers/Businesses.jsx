import React, { Component } from "react";
import { Card, CardTitle, Badge, CustomInput } from "reactstrap";


class Businesses extends Component {
  render() {
    const { node, checks, onInputChange } = this.props;
    const businesses = node.processes.map(process=>(process.group))
    return (
      <React.Fragment>
        <Card body>
          {businesses.map(business=>(
            <CardTitle key={business}>
              <CustomInput
              type="checkbox"
              name={business}
              label={business}
              id={business}
              checked={checks.indexOf(business) >= 0}
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

export default Businesses;
