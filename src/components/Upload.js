import React from 'react';
import Dropzone from 'react-dropzone';
import { db } from 'baqend';
import JSZip from "jszip";

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

    console.log(accepted_gcodes[0]);

    var zip = new JSZip();
    zip.file(accepted_gcodes[0].name, accepted_gcodes[0])

    zip.generateAsync({type: 'blob', compression: 'DEFLATE', compressionOptions: {level: 7}}, (metadata) => {
      console.log(metadata.percent);
    }).then((zip) => {
        console.log(zip);
        // const gcode_ref = new db.File({name: accepted_gcodes[0].name, parent: '/gcodes/', data: zip, type: 'blob'})
        // gcode_ref.upload()
        //   .then((file) => {
        //     console.log(file);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   })
      })
      .catch((error) => {
        console.log(error);
      })

  }

  onGcodeClick(e) {
    e.preventDefault();
    this.gcode_dropzone.open();
  }

  imageUpload(e) {
    const image_ref = new db.File({parent: '/images/', data: this.state.images[0], type: 'blob'})

    image_ref.upload()
      .then((file) => {
        console.log(file);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {

    // Create Component of material selector.
    const materials = [
      "None",
      "PLA",
      "ABS",
      "Flex",
      "XT(Hybrid)",
      "nGen",
      "Nylon",
      "PVA",
      "Carbon",
      "Wood",
      "Other"
    ]

    const material_options = [];
    materials.forEach((material, index) => {
      material_options.push(<option key={index}>{material}</option>)
    })
    return (
      <div className="App-upload">
        <div className="upload-wrapper">
          <form id="upload-gcode" className="upload-info" action="">
            <div className="upload-item">
              <label htmlFor="gcode_name">Name</label>
              <input id="gcode_name" type="text" placeholder="Sample gcode name"/>
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
              <input id="gcode_print_time_days" type="text" placeholder="DD:HH:MM"/>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_description">Description</label>
              <input id="gcode_description" type="text" placeholder="Short description of model and gcode"/>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_upload_file">Gcode</label>
              <Dropzone
                className="upload-gcode-file"
                ref={(node) => { this.gcode_dropzone = node; }}
                multiple={false}

                accept=".gcode, .zip"
                onDrop={this.onGcodeDrop.bind(this)}>
                {this.state.gcode_file.length > 0 ? <div>{this.state.gcode_file.map((gcode) => <input type='text' placeholder="Drop your gcode here or click to select" disabled key={gcode.name} value={gcode.name} style={{width: '80%'}}/>)}</div> 
                : <input type='text' placeholder="Drop your gcode here or click to select" disabled style={{width: '80%'}}/> }
              </Dropzone>
              <button onClick={(e) => this.onGcodeClick(e) } style={{maxWidth: '10em', borderRadius: '0px', fontSize: '1em', padding: '0px'}}>GCODE</button>
            </div>
          </form>
          <div className="upload-data">
            <Dropzone 
              className="upload-image"
              multiple={false}
              accept="image/*"
              maxSize={2097152}
              placeholder="Drop your gcode here or click to select."
              onDrop={this.onImageDrop.bind(this)}>
              {
                this.state.images.length > 0 ? 
                <div className="gcode-image">
                  {this.state.images.map((image) => <img className="" key={image.name} src={image.preview} alt={image.name} />  )}
                </div> 
                : 
                <div>
                  <span>Drop image here or click to upload</span>
                </div> 
              }
            </Dropzone>
          </div>
          <button style={{flexBasis: '100%', marginTop: '20px'}} onClick={(e) => this.imageUpload(e)}>UPLOAD</button>
          div.
        </div>
      </div>
    )
  }
}

export default Upload;
