import React from 'react';
import Dropzone from 'react-dropzone';
import { db } from 'baqend';
import JSZip from "jszip";
import  sanitize  from 'sanitize-filename';
import { getDateTimeString, getFileExtension } from './Helpers';
import { machines, materials } from "./Globals";

class Upload extends React.Component {
  constructor() {
    super();
    this.selectPrintMode = this.selectPrintMode.bind(this);
    this.printModeClass = this.printModeClass.bind(this);
    this.printSyncMirror = this.printSyncMirror.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePrintTime = this.handlePrintTime.bind(this);
    this.onGcodeDrop = this.onGcodeDrop.bind(this);
    this.createFilename = this.createFilename.bind(this);

    this.state = {
      images: [],
      gcode_file: [],
      gcode_upload: {
        name: '',
        machine: 0,
        material_left: 0,
        material_right: 0,
        print_mode: 0,
        sync_mirror: 1,
        layer_height: '',
        print_time_string: '',
        print_time_seconds: 0,
        description: ''
      }
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
        this.zipped_gcode = zip;
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

  selectPrintMode(e, mode) {
    e.preventDefault();
    let new_gcode = {...this.state.gcode_upload};
    new_gcode.print_mode = mode;
    if (mode === 1 ) {
      new_gcode.sync_mirror = 0;
    }
    this.setState({gcode_upload: new_gcode});
  }

  printSyncMirror(e, mode) {
    e.preventDefault();
    let new_gcode = {...this.state.gcode_upload};
    new_gcode.sync_mirror = mode;

    this.setState({gcode_upload: new_gcode});
  }

  printSyncMirrorClass(mode) {
    return this.state.gcode_upload.sync_mirror === mode ? 'print_mode_select active' : 'print_mode_select';

  }

  printModeClass(mode) {
    return this.state.gcode_upload.print_mode === mode ? 'print_mode_select active' : 'print_mode_select';
  }

  handleChange(e) {
    const gcode = this.state.gcode_upload;
    const new_gcode = {
      ...gcode,
      [e.target.name]: e.target.value
    }

    // Handle material difference
    if ((new_gcode.material_left !== 'None' && new_gcode.material_right !== 'None') &&
       (new_gcode.material_left !== new_gcode.material_right)) {
      new_gcode.print_mode = 1;
      new_gcode.sync_mirror = 0;
    }

    this.setState({gcode_upload: new_gcode});
  }

  handlePrintTime(e) {
    const print_time_string = e.target.value; 
    const regex = /(\d{2}):(\d{2}):(\d{2})/;
    let print_time_seconds = 0;


    let match = print_time_string.match(regex); 

    if (match) {
      let days, hours, minutes, seconds;
      [days, hours, minutes] = match.slice(1 - match.length);  
      seconds = parseInt(days,10)*24*60*60 + parseInt(hours,10)*60*60 + parseInt(minutes,10)*60; 
      print_time_seconds = seconds; 
    }

    const gcode = this.state.gcode_upload;
    const new_gcode = {
      ...gcode,
      [e.target.name]: e.target.value,
      print_time_seconds
    }

    this.setState({gcode_upload: new_gcode});
  }

  gcodeUpload (e) {
    e.preventDefault();
    if (this.state.gcode_file.length === 0 || this.state.images.length === 0) {
      console.log("No image or gcode added, aborting");
      return;
    }

    let pending_uploads = [];

    const file_ext = getFileExtension(this.state.images[0].name);
    const image_name = this.createFilename() + '.' + file_ext;

    // Let's upload the image
    const image_ref = new db.File({name: image_name, parent: '/images/', data: this.state.images[0], type: 'blob'})
    pending_uploads.push(image_ref.upload()
      .then((image) => {
        this.image_id = image.id;
      })
      .catch((error) => {
        console.log(error);
        return // we failed uploading the image bail from everything.
      })
    );

    // Let's upload the gcode
    const gcode_ref = new db.File({name: this.createFilename(), parent: '/gcodes/', data: this.zipped_gcode, type: 'blob'})
    
    pending_uploads.push(gcode_ref.upload()
      .then((file) => {
        this.gcode_id = file.id
      })
      .catch((error) => {
        console.log(error);
        return // we failed uploading the image bail from everything.
      })
    );

    Promise.all(pending_uploads).then(() => {
      console.log("Uploads done!");
      console.log('db.User.me.username');
      // So we are done uploading we can create an entry in the database
      const gcode = this.state.gcode_upload;
      const new_gcode = {
        ...gcode,
        image_id: this.image_id,
        gcode_id: this.gcode_id,
        upload_date: new Date(),
        user: db.User.me,
        verified: true
      }

      const gcode_entry = new db.Gcode(new_gcode)

      gcode_entry.insert().then(() => {
        console.log("Inserted!");
        console.log(gcode_entry.version);
        this.context.router.transitionTo('/');
      })

    })
  }

  createFilename() {
    // Creates a filename related the the upload info
    // Output will be san-tized name in Name_LeftMaterial_RightMaterial_LayerHeight_PrintMode_SyncMode
    const name = sanitize(this.state.gcode_upload.name);
    const machine = machines[this.state.gcode_upload.machine]
    const left = this.state.gcode_upload.material_left;
    const right = this.state.gcode_upload.material_right;
    const layer_height = this.state.gcode_upload.layer_height;
    const print_mode = this.state.gcode_upload.print_mode ? "Dual" : "Normal";
    const sync_mirror = this.state.gcode_upload.sync_mirror ? "SyncYes" : "SyncNo";
    const date_time = getDateTimeString();

    return `${name}_${machine}_${left}_${right}_${layer_height}_${print_mode}_${sync_mirror}_${date_time}`
  }

  render() {

    // Create Component of material selector.


    const regex = /(\d{2}):(\d{2}):(\d{2})/;
    let print_time_match = this.state.gcode_upload.print_time_string.match(regex);

    if (this.state.gcode_upload.print_time_string === '') {
      print_time_match = true;
    }

    const material_options = [];
    materials.forEach((material, index) => {
      material_options.push(<option value={index} key={index}>{material}</option>)
    })

    const machine_options = [];
    machines.forEach((machine, index) => {
      machine_options.push(<option value={index} key={index}>{machine}</option>)
    })
    return (
      <div className="App-upload">
        <div className="upload-wrapper">
          <form id="upload-gcode" className="upload-info" onSubmit={(e) => this.gcodeUpload(e)}>
            <div className="upload-item">
              <label htmlFor="gcode_name">Name</label>
              <input 
                id="gcode_name" 
                name="name" 
                value={this.state.gcode_upload.name}
                type="text" 
                placeholder="Sample gcode name"
                required
                onChange={(e) => this.handleChange(e)}/>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_machine_type">Machine</label>
              <div className="styled-select">
                <select 
                  id="gcode_machine_type" 
                  type="text"
                  name="machine"
                  onChange={(e) => this.handleChange(e)}>
                {machine_options}
                </select>
              </div>
            </div>
            <div className="upload-item upload-material">
              <label htmlFor="gcode_material_left">Left</label>
              <div className="styled-select">
                <select 
                  value={this.state.gcode_upload.material_left}
                  id="gcode_material_left" 
                  name="material_left"
                  type="text"
                  required
                  onChange={(e) => this.handleChange(e)}>
                  {material_options}
                </select>
              </div>
            </div>
            <div className="upload-item upload-material">
              <label htmlFor="gcode_material_right">Right</label>
              <div className="styled-select">
                <select 
                  value={this.state.gcode_upload.material_right}
                  id="gcode_material_right" 
                  name="material_right"
                  type="text"
                  required
                  onChange={(e) => this.handleChange(e)}>
                {material_options}
                </select>
              </div>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_print_mode">Print mode</label>
              <button className={this.printModeClass(0)} onClick={(e) => this.selectPrintMode(e, 0)}>NORMAL</button>
              <button className={this.printModeClass(1)} onClick={(e) => this.selectPrintMode(e, 1)}>DUAL</button>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_sync_mirror">Sync/Mirror?</label>
              <button className={this.printSyncMirrorClass(1)} onClick={(e) => this.printSyncMirror(e, 1)}>YES</button>
              <button className={this.printSyncMirrorClass(0)} onClick={(e) => this.printSyncMirror(e, 0)}>NO</button>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_layer_height">Layer Height</label>
              <input 
                value={this.state.gcode_upload.layer_height}
                name="layer_height"
                id="gcode_layer_height" 
                type="number" 
                placeholder="100"
                required
                onChange={(e) => this.handleChange(e)}/>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_print_time_days">Print time</label>
              <input 
                value={this.state.gcode_upload.print_time_string}
                name="print_time_string"
                className={ print_time_match ? null : "error_border"}
                id="gcode_print_time_days" 
                type="text" 
                placeholder="DD:HH:MM"
                required
                onChange={(e) => this.handlePrintTime(e)}/>
            </div>
            <div className="upload-item">
              <label htmlFor="gcode_description">Description</label>
              <input
                value={this.state.gcode_upload.description}
                id="gcode_description"
                name="description"
                type="text" 
                placeholder="Short description of model and gcode"
                required
                onChange={(e) => this.handleChange(e)}/>
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
          <button form="upload-gcode" style={{flexBasis: '100%', marginTop: '20px'}} type="submit">UPLOAD</button>
        </div>
      </div>
    )
  }
}

Upload.contextTypes = {
  router: React.PropTypes.object
}

export default Upload;
