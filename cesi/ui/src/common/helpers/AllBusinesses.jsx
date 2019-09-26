import React, { Component } from "react";
import { Card, CardTitle, Badge, CustomInput } from "reactstrap";


class AllBusinesses extends Component {
  getAllBusinesses = nodes => {
       var allProcesses = []
       nodes.map(node=>{
          var processes = node.processes
          processes.map(process=>{
            allProcesses.push(process)
          })
       })
      var allBusinesses = allProcesses.map(process=>(process.group))
      return Array.from(new Set(allBusinesses))
  };

  render() {
    const { nodes, check, onInputChange } = this.props;
    const allBusinesses = this.getAllBusinesses(nodes)
    return (
      <React.Fragment>
        <Card body>
          {allBusinesses.map(business=>(
            <CardTitle key={business}>
              <CustomInput
              type="checkbox"
              name={business}
              label={business}
              id={business}
              checked={check==business}
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

export default AllBusinesses;
