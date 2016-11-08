import React from 'react';

class Filter extends React.Component {
  render() {
    return (
        <div className="Gcode-filter">
            <ul className="filter">
                <li className="heading">Machine</li>
                <li className="machine_type">
                    <div className="check_box">
                        <input id='type_bolt' type='checkbox' name='machine_type' value='bolt' />
                        <label htmlFor='type_bolt'></label>
                    </div>
                    <div className="machine_name">Bolt</div>
                </li>
                <li className="machine_type">
                    <div className="check_box">
                        <input id='type_hs' type='checkbox' name='machine_type' value='hs' />
                        <label htmlFor='type_hs'></label>
                    </div>
                    <div className="machine_name">HS</div>
                </li>
                <li className="machine_type">
                    <div className="check_box">
                        <input id='type_hsxl' type='checkbox' name='machine_type' value='hsxl' />
                        <label htmlFor='type_hsxl'></label>
                    </div>
                    <div className="machine_name">HS XL</div>
                </li>
                <li className="machine_type">
                    <div className="check_box">
                        <input id='type_xeed' type='checkbox' name='machine_type' value='xeed' />
                        <label htmlFor='type_xeed'></label>
                    </div>
                    <div className="machine_name">Xeed</div>
                </li>
                <li className="machine_type">
                    <div className="check_box">
                        <input id='type_xcel' type='checkbox' name='machine_type' value='xcel' />
                        <label htmlFor='type_xcel'></label>
                    </div>
                    <div className="machine_name">Xcel</div>
                </li>
            </ul>
        </div>
    )
  }
}

export default Filter;