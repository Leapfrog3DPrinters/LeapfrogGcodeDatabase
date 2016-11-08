import React from 'react';
import { Link } from 'react-router';

class Gcode extends React.Component {
  render() {
  	const { details, index } = this.props;
    return (
      <li className='gcode'>
      	<Link to={`/gcode/${index}`}>
	      	<div className="gcode-image">
	      		<img src={details.image} alt='Ja' />
	      		<span>{details.name}</span>
	      	</div>
      	</Link>
      </li>
    )
  }
}

export default Gcode;