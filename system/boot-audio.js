/** TC-HQ boot audio — original synthesised POST and system cues, no media files. */
(function(){
 'use strict';
 const AudioContextClass=window.AudioContext||window.webkitAudioContext;
 function create(preferences={},search=new URLSearchParams()){
  const requested=search.get('sound');
  const enabled=requested==='on'||(requested!=='off'&&preferences.sound!==false);
  const percent=(value,fallback)=>Math.max(0,Math.min(100,Number.isFinite(Number(value))?Number(value):fallback));
  const oldVolume=Number(preferences.volume);
  const masterLevel=preferences.volumeScaleVersion===2?preferences.volume:
   (!Number.isFinite(oldVolume)||oldVolume===35?50:Math.round(oldVolume/3));
  const master=percent(masterLevel,50)/100;
  const effects=percent(preferences.effectsVolume,55)/100;
  // One third of the new slider has the former full-scale amplitude.
  const maxGain=0.07*3*master*effects;
  let context=null;
  const available=()=>enabled&&maxGain>0&&!!AudioContextClass;
  const getContext=()=>{
   if(!available())return null;
   try{return context||(context=new AudioContextClass())}catch{return null}
  };
  function isRunning(){return !!context&&context.state==='running'}
  function unlock(){
   const audio=getContext();
   if(!audio)return Promise.resolve(false);
   if(audio.state==='running')return Promise.resolve(true);
   return audio.resume().then(()=>audio.state==='running').catch(()=>false);
  }
  function tone(hz,delay,duration,amount=0.6,type='sine',endHz=hz){
   const audio=getContext();
   if(!audio||audio.state!=='running')return false;
   try{
    const at=audio.currentTime+delay,osc=audio.createOscillator(),gain=audio.createGain();
    const peak=Math.max(0.0001,maxGain*amount);
    osc.type=type;
    osc.frequency.setValueAtTime(Math.max(20,hz),at);
    if(endHz!==hz)osc.frequency.exponentialRampToValueAtTime(Math.max(20,endHz),at+duration);
    gain.gain.setValueAtTime(0.00001,at);
    gain.gain.exponentialRampToValueAtTime(peak,at+Math.min(.012,duration*.25));
    gain.gain.exponentialRampToValueAtTime(0.00001,at+duration);
    osc.connect(gain);gain.connect(audio.destination);
    osc.start(at);osc.stop(at+duration+.006);
    osc.onended=()=>{osc.disconnect();gain.disconnect()};
    return true;
   }catch{return false}
  }
  function play(cue){
   if(!getContext()||!isRunning())return false;
   switch(cue){
    case 'power':
     tone(100,0,.19,.43,'triangle',165);
     tone(202,.09,.13,.21,'sine',250);
     break;
    case 'post': tone(940,0,.105,.65,'sine');break;
    case 'tick': tone(370,0,.023,.30,'triangle',300);break;
    case 'link':
     tone(560,0,.065,.48,'sine',640);
     tone(760,.095,.063,.40,'sine');
     break;
    case 'warn': tone(400,0,.13,.40,'triangle',260);break;
    case 'ready':
     tone(540,0,.09,.53,'sine');
     tone(720,.13,.10,.52,'sine');
     tone(960,.28,.21,.58,'sine');
     break;
    default:return false;
   }
   return true;
  }
  function close(){if(context){context.close().catch(()=>{});context=null}}
  return {available,isRunning,unlock,play,close};
 }
 window.TCBootAudio={create};
})();
