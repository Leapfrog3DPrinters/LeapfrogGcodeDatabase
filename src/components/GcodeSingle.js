import React from 'react';
import Gcode from './Gcode.js'

class GcodeSingle extends React.Component {

  render() {
  	const gcode = this.props.gcodes[this.props.params.gcodeId];
    return (
        <ul className="Gcode-single">
          <Gcode index={'/'} details={ gcode } />
        </ul>
    )
  }
}

export default GcodeSingle;