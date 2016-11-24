import React from 'react';
import { Link } from 'react-router';
import { db } from 'baqend';
import { machines, materials } from './Globals'

class Gcode extends React.Component {
  render() {
  	const { details, index } = this.props;
    const image_url = db.createURL(details.image_id);
    const machine_name = machines[details.machine];
    const material_left = materials[details.material_left];
    const material_right = materials[details.material_right];

    return (
      <li className='gcode'>
      	<Link to={index}>
	      	<div className="gcode-image">
	      		<img src={image_url} alt='Gcode Preview' />
	      		<div className="gcode-info">
	      		{details.name}<br/>
            {machine_name}<br/>
            {`${material_left} ${material_right}`}<br />
	      		</div>
	      	</div>
      	</Link>
        <a href={db.createURL(details.gcode_id)}>Download</a>
      </li>
    )
  }
}

export default Gcode;