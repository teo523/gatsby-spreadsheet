import {MidiParser} from './midi-parser.js'
    // select the INPUT element that will handle
    // the file selection.
    
    let loading = document.getElementById('loading');
    loading.style.display = "none"
    var result = [];
    var result2 = [];
    let source = document.getElementById('filereader');
    let source2 = document.getElementById('filereader2');

    source.addEventListener("change", showLoading);
    
    function showLoading(e) {
      loading.style.display = "block"
    }


    // provide the File source and a callback function
    MidiParser.parse( source, function(obj){

      console.log(obj);
      
      let changeBPM = [];
      let changeSig = [];
      let elemTrack;
      let metaTrack;
      

      //If there is metatrack, we assume track in index 1 will contain the midi notes. 
      // This code doesn't work for multitrack midi files.
      if (obj.tracks > 1) {
      metaTrack = obj.track[0].event;
      elemTrack = obj.track[1].event;

     
      let metaTicks = 0;

      for (var l in metaTrack){

      metaTicks = metaTicks + metaTrack[l].deltaTime;
        if (metaTrack[l].metaType == 81){
           console.log("addedmeta");
          changeBPM.push([metaTicks,metaTrack[l].data]);
        }

        if (metaTrack[l].metaType == 88){
          changeSig.push([metaTicks,[metaTrack[l].data[0],metaTrack[l].data[1]]]);

        }

      }

      }

      else {
      elemTrack = obj.track[0].event;}
      
      console.log(changeSig);
      console.log(elemTrack);


      let ticks_per_quarter = obj.timeDivision;
      let currentTicks = 0;
      let currentTime = 1;
      let currentBar = 1 ;
      let currentBPM = 144;
      let currentDenom = 4;
      let currentNum = 2;
      let delta;
      let delta_msec;
      let k = 0;


      for(var i in elemTrack) {

        /*if (j < changeBPM.length) {
          if (currentTicks + elemTrack[i].deltaTime >= changeBPM[j][0]){
            currentBPM = (1000000 / changeBPM[j][1]) * 60;
            console.log("changed BPM");
            j = j + 1;
          }

        }

        if (k < changeSig.length) {
          if (currentTicks + elemTrack[i].deltaTime >= changeSig[k][0] ) {
            currentNum = changeSig[k][1][0];
            console.log(currentTicks + ": changed signature to " + currentNum);
            k = k + 1;
          }
        }*/



       
          currentTicks = currentTicks + elemTrack[i].deltaTime;

          
          var bar = 1;

          for(var j=0; j<changeSig.length;j++){
            //if the current tick is beyond the next change of signature, we calculate the bars directly by division
            if(j < changeSig.length - 1){
              if(changeSig[j+1][0]<currentTicks){
                bar = bar + (changeSig[j+1][0] - changeSig[j][0])/(ticks_per_quarter * changeSig[j][1][0]);
              }
              else {
                bar = bar + (currentTicks - changeSig[j][0])/(ticks_per_quarter * changeSig[j][1][0]);
                currentNum = changeSig[j][1][0];
                break;
              }
            }

            else {
              bar = bar + (currentTicks - changeSig[j][0])/(ticks_per_quarter * changeSig[j][1][0]);
              currentNum = changeSig[j][1][0];
              break;
            }
            

          }


          currentBar = Math.floor(bar);

          let cQ = bar - currentBar;

          let currentQuarter = Math.floor((cQ * currentNum) + 1);

          let cT =  (cQ - (currentQuarter - 1) / currentNum) / (1/currentNum);

          let currentTick = Math.floor((cT * ticks_per_quarter));

     
          
          if (elemTrack[i].type == 8) {
          result.push([currentTicks, currentBar + "." + currentQuarter + "." + currentTick ,"NOTE_OFF", elemTrack[i].data[0],elemTrack[i].data[1],1,"",""]);
          }

          if (elemTrack[i].type == 9) {
          result.push([currentTicks, currentBar + "." + currentQuarter + "." + currentTick ,"NOTE_ON", elemTrack[i].data[0],elemTrack[i].data[1],1,"",""]);
          }

       
      }

      console.log(result);

      



      for(var row in result){



        if(result[row][2]=="NOTE_ON"){
          result2.push([result[row][0],result[row][1],result[row][3],result[row][4]]);
          
          for (var secRow = parseInt(row) + 1; secRow < result.length; secRow++) {
            // console.log(result[1]);
            if (result[secRow][2]=="NOTE_OFF" && result[secRow][3]==result[row][3]){
              result2[result2.length - 1].push(result[secRow][1]);
            }
            
          }
        
        }

      }


 

    loading.style.display = "none"
    } );

     MidiParser.parse( source2, function(obj){
      let changeBPM = [];
      let elemTrack;
      let metaTrack;

     
      if (obj.tracks > 1) {
        metaTrack = obj.track[0].event;
        elemTrack = obj.track[1].event;


       
        let metaTicks = 0;

        for (var l in metaTrack){

        metaTicks = metaTicks + metaTrack[l].deltaTime;
          if (metaTrack[l].metaType == 81){
             console.log("addedmeta");
            changeBPM.push([metaTicks,metaTrack[l].data]);
          }


        }
        var row = 0;


        
        for (let j=0;j<changeBPM.length;j++){
          /*console.log("j= " + j);
          console.log("changeBPM= " + changeBPM);
          console.log("changeBPM.length= " + changeBPM.length);
          console.log("changeBPM[j+1]= " + changeBPM[parseInt(j)+1]);*/
          

          if (j < changeBPM.length - 1 && row < result2.length){
            while(result2[row][0]<changeBPM[j+1][0] ){
              result2[row].push((1000000 / changeBPM[j][1]) * 60);
              row = row + 1;
              if (row == result2.length) {
                break;
              }
              // console.log("changeBPM[j+1][0]= " + changeBPM[j+1][0]);
              // console.log("result2[row][0]= " + result2[row][0]);
            }
          }
          else {
            while(row < result2.length){
              result2[row].push((1000000 / changeBPM[j][1]) * 60);
              row = row + 1;
            }
          }
        }

        }

      else {
        console.log("ERROR: midi file contains no track for tempo.");
      }





      const sp = Spreadsheet('#midispreadsheet');
      sp.createSpreadsheet(
  {
    // bar: 'text',
    // message_type: 'text',
    // 'pitch': 'number',
    // 'velocity': 'number',
    // 'recorded_tempo': 'number',
    // Start_Ctrl: 'text',
    // End_Ctrl: 'text',
    
    tickInit: 'text',
    barInit: 'text',
    pitch: 'text',
    'velocity': 'number',
    barEnd: 'text',
    recTempo: 'text',


  },
  {
    data: result2,
  }
);
     } );