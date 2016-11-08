import React from 'react';

class GcodeSingle extends React.Component {
  render() {
  	const gcode = this.props.gcodes[this.props.params.gcodeId];
    return (
        <div className="Gcode-single">
          <h1> Name: {gcode.name}</h1>
          <img src={gcode.image} alt='Gcode' />
          <br/>
          {gcode.desc}
        </div>
    )
  }
}

export default GcodeSingle;