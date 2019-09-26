import React, { Component } from "react";
import { Card, CardTitle, Badge, CustomInput } from "reactstrap";


class BusinessNodes extends Component {
  getShowNodes = (nodes, business) => {
        var showNodes = []
        nodes.map(node=>{
           var processes = node.processes
           processes.map(process=>{
             if(business == process.group){
                showNodes.push(node)
             }
           })
        })
        return showNodes
  };
  render() {
    const { nodes, checks, business, onInputChange } = this.props;
    const showNodes = this.getShowNodes(nodes, business)
    return (
      <React.Fragment>
        { showNodes.length >0 ? (
          <Card body>
           {showNodes.map(node=>(
              <CardTitle key={node.general.name}>
              <CustomInput
              type="checkbox"
              name={node.general.name}
              label={node.general.name}
              id={node.general.name}
              checked={checks.indexOf(node.general.name) >= 0}
              onChange={onInputChange}
              inline
            />
            </CardTitle>
          ))} 
        </Card>
        ) : ( <div></div>)}
      </React.Fragment>
    );
  }
}
export default BusinessNodes;
