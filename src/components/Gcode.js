import React from 'react';
import { Link } from 'react-router';

class Gcode extends React.Component {
  render() {
  	const { details, index } = this.props;
    return (
      <li className='gcode'>
      	<Link to={index}>
	      	<div className="gcode-image">
	      		<img src={details.image} alt='Gcode Preview' />
	      		<div className="gcode-info">
	      		{details.name}<br/>
	      		</div>
	      	</div>
      	</Link>
      </li>
    )
  }
}

export default Gcode;