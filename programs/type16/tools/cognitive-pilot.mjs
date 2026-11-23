#!/usr/bin/env node
/** Offline cognitive-interview helper. No logging of responses or networking. */
import {readFileSync} from 'node:fs';
import {createPilotForm,summarizePilotObservations} from '../js/engine/pilot.js';

function usage(){
  process.stderr.write('Usage:\n  node tools/cognitive-pilot.mjs form <A|B|C|D> <es|en> [current|candidate|source] [rotation 0..7]\n  node tools/cognitive-pilot.mjs summarize <local-observations.json>\n');
  process.exitCode=2;
}
try{
  const [command,...args]=process.argv.slice(2);
  if(command==='form'){
    if(args.length<2||args.length>4)usage();
    else{
      const [formId,locale,variant,rotation='0']=args;
      const form=createPilotForm({formId,locale,variant,rotation:Number(rotation)});
      process.stdout.write(JSON.stringify(form,null,2)+'\n');
    }
  }else if(command==='summarize'){
    if(args.length!==1)usage();
    else{
      const records=JSON.parse(readFileSync(args[0],'utf8'));
      process.stdout.write(JSON.stringify(summarizePilotObservations(records),null,2)+'\n');
    }
  }else usage();
}catch(error){
  process.stderr.write(`${error.name}: ${error.message}\n`);
  process.exitCode=1;
}
