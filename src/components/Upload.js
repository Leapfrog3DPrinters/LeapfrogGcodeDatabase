import React from 'react';
import Dropzone from 'react-dropzone';

class Upload extends React.Component {
  constructor() {
    super();

    this.state = {
      images: [],
      gcode_file: []
    };
  }


  onImageDrop(accepted_images, rejected_images) {
    if (rejected_images.length > 0) {
      console.log ("Image Rejected!")
      return
    }
    this.setState({
      images: accepted_images
    });
  }

  onGcodeDrop(accepted_gcodes, rejected_gcodes) {
    if (rejected_gcodes.length > 0) {
      console.log ("Gcode Rejected!")
      return
    }
    this.setState({
      gcode_file: accepted_gcodes
    })
  }

  onGcodeClick(e) {
    e.preventDefault();
    this.gcode_dropzone.open();
  }

  render() {

    // Create Component of material selector.
    const materials = [
      "PLA",
      "ABS",
      "Flex",
      "XT(Hybrid)",
      "nGen",
      "Nylon",
      "PVA",
      "Carbon",
      "Wood"
    ]

    const material_options = [];
    materials.forEach((material, index) => {
      material_options.push(<option key={index}>{material}</option>)
    })
    return (
      <div className="App-upload">
        <form id="upload-gcode" className="upload-info" action="">
          <div className="upload-item">
            <label htmlFor="gcode_name">Name</label>
            <input  id="gcode_name" type="text"/>
          </div>
          <div className="upload-item">
            <label htmlFor="gcode_machine_type">Machine</label>
            <div className="styled-select">
              <select id="gcode_machine_type" type="text">
                <option value={0}>Bolt</option>
                <option value={1}>Creatr HS</option>
                <option value={2}>Creatr HS XL</option>
                <option value={3}>Xcel</option>
                <option value={4}>Xeed</option>
              </select>
            </div>
          </div>
          <div className="upload-item upload-material">
            <label htmlFor="gcode_material_left">Left</label>
            <div className="styled-select">
              <select id="gcode_material_left" type="text">
              {material_options}
              </select>
            </div>
          </div>
          <div className="upload-item upload-material">
            <label htmlFor="gcode_material_right">Right</label>
            <div className="styled-select">
              <select id="gcode_material_right" type="text">
                {material_options}
              </select>
            </div>
          </div>
          <div className="upload-item">
            <label htmlFor="gcode_print_time_days">Print time</label>
            <input id="gcode_print_time_days" type="text"/>
            <label className="upload-print-time" htmlFor="gcode_print_time_days">DD:HH:MM</label>
          </div>
          <div className="upload-item">
            <label htmlFor="gcode_description">Description</label>
            <input id="gcode_description" type="text"/>
          </div>
          <div className="upload-item">
            <label htmlFor="gcode_upload_file">Gcode</label>
            <Dropzone
              className="upload-gcode-file"
              ref={(node) => { this.gcode_dropzone = node; }}
              multiple={false}
              accept=".gcode, .zip"
              onDrop={this.onGcodeDrop.bind(this)}>
              {this.state.gcode_file.length > 0 ? <div>{this.state.gcode_file.map((gcode) => <input type='text' disabled key={gcode.name} value={gcode.name} style={{width: '80%'}}/>)}</div> : null }
            </Dropzone>
            <button onClick={(e) => this.onGcodeClick(e) } style={{maxWidth: '10em', borderRadius: '0px'}}>GCODE</button>
          </div>
        </form>
        <div className="upload-data">
          <Dropzone 
            className="upload-image"
            multiple={false}
            accept="image/*"
            maxSize={2097152}
            onDrop={this.onImageDrop.bind(this)}>
            <p>Drop image here</p>
            {this.state.images.length > 0 ? <div className="gcode-image">{this.state.images.map((image) => <img className="" key={image.name} src={image.preview} alt={image.name} />  )}</div> : null }
          </Dropzone>
        </div>
      </div>
    )
  }
}

export default Upload;
