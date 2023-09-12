import Helmet from "react-helmet"
import { withPrefix, Link } from "gatsby"
import * as React from "react"
import MidiWriter from 'midi-writer-js';


export default function Home() {

  
  var parseMidi = require('midi-file').parseMidi
  var writeMidi = require('midi-file').writeMidi
  
  // Read MIDI file into a buffer


return (
  <body>
  <div>
     <Helmet>
        <script src={withPrefix('script.js')} type="module" />
        <script src={withPrefix('spreadsheet.js')} type="text/javascript" />
        <script src={withPrefix('examples.js')} type="text/javascript" />
    </Helmet>
  </div>
  <div className="page-wrapper">
      

      <section className="text-center">
        <div id="loading">
          <p>Loading MIDI data, please wait...</p>
        </div>
        <div id="introText">
          <ol>
            <li>Upload a MIDI file</li>
            <li>Edit the spreadsheet</li>
            <li>Download the resulting spreadsheet as a new MIDI file</li>
          </ol>

        </div>
        <div className="container">
          <div className="row">
            <div className="column">
              
              <h4> Notes </h4>
              
             <input type="file" id="filereader" />
            </div>

            <div className="column">
              <h4> Recorded Time </h4>
              <input type="file" id="filereader2" />
            </div>
          </div>
         
          
          <div className="spreadsheet-example">
            
            <div id="midispreadsheet"></div>
          </div>
          
        </div>
  
      </section>
    </div>
  </body>
 

  )
}
