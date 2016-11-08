import React from 'react';

import Filter from './Filter';
import Gcode from './Gcode';

class GcodeList extends React.Component {
  render() {
    return (
        <div className="Gcode-list">
        	<Filter />
        	<ul className="gcodes">
        	{
        	  Object
        	    .keys(this.props.gcodes)
        	    .map(key => <Gcode key={key} index={`/gcode/${key}`} details={this.props.gcodes[key]}/>)
        	}
        	</ul>
        </div>
    )
  }
}

export default GcodeList;