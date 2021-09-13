
// I can't figure out how to import these when they're in an external file. So here they are
let languages = [
  {
      language: "English",
      whitetile:"white tile",
      blacktile: "black tile",
      attack: "You attack",
      attacked: "Opponent attacked",
      attackable: "can attack",
      victory: "victory"
  },
  
  {
      language: "french",
      whitetile: "jeton blanc",
      blacktile: "jeton noir",
      attack: "vous attaquez",
      attacked: "L'adversaire a attaqué",
      attackable: "attaque possible",
      victory: "victoire"
  },
  
  {
      language: "finnish",
      whitetile: "valkoinen nappula",
      blacktile: "musta nappula",
      attack: "sinä hyökkäät",
      attacked: "vihollinen hyökkäsi",
      attackable: "mahdollista hyökätä",
      victory: "voitto!"
  },
  
  {
      language: "Deutsch",
      whitetile: "weiße Fliese",
      blacktile: "schwarze Fliese",
      attack: "du greifst an",
      attacked: "Gegner angegriffen",
      attackable: "je kunt aanvallen",
      victory: "Spiel gewonnen"
  },
  
  {
      language: "español",
      whitetile: "azulejo blanco",
      blacktile: "azulejo negro",
      attack: "tu atacas",
      attacked: "oponente atacado",
      attackable: "puedes atacar",
      victory: "victoria"
  
  },
  {
    language: "italiano",
    whitetile: "piastrelle bianche",
    blacktile: "piastrelle nera",
    attack: "tu attacchi",
    attacked: "avversario attaccato",
    attackable: "puoi attaccare",
    victory: "vittoria"
  },
  { language: "polski",
    whitetile: "biała płytka",
    blacktile: "czarna płytka",
    attack: "atakujesz",
    attacked: "przeciwnik zaatakowany",
    attackable: "możesz zaatakować",
    victory: "zwycięstwo"},

  { language: "Nederlandes",
    whitetile: "witte tegel",
    blacktile: "zwarte tegel",
    attack: "je valt aan",
    attacked: "tegenstander aangevallen",
    attackable: "je kunt aanvallen",
    victory: "jij hebt gewonnen"}
  ]
// Stop languages


const rate = document.querySelector('#rate');
var rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('#pitch-value');
var voiceSelect = document.querySelector('#voice-select');




// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
let voices;

  if ('speechSynthesis' in window) {
    console.log("Speech Synthesis supported");
    const synth = window.speechSynthesis;

   }else{
     console.log("Speech Synthesis Not Supported 😣");
     alert("Sorry, your browser doesn't support text to speech!");
   }
   
   function populateVoiceList() {
    if(typeof speechSynthesis === 'undefined') {
      return;
    }
  
    voices = speechSynthesis.getVoices();
  
    for(var i = 0; i < voices.length; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
      //console.log(voices[i]);
  
      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
        //the default should change based on location.
        //in finland it is deutsch since there's no finnish
      }

      //console.log(decodeURIComponent(getCookieValue('voiceName')))
      //console.log(voices[i].name);

      if(decodeURIComponent(getCookieValue('voiceName')) === voices[i].name) {
        //console.log("hello")
          option.selected = 'selected';
      }
  
      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      //console.log(voices[i].name)
      voiceSelect.appendChild(option);
    }
// after the voiceList has been populated, I can select the default from the cookie

  //let languageOptions = document.querySelector('#voice-select').options;



  //

  }

console.log(document.cookie)

  
  populateVoiceList();
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  
  
  function speakTest() {
    var msg = new SpeechSynthesisUtterance();
    msg.text = "Le joueur blanc a joué sur la case 4'g'";
    window.speechSynthesis.speak(msg);
  }





// msg.text = "Le joueur blanc a joué sur la case 4'g'";
  function speakMove(instruction, x="", y="",) {

      
    var msg = new SpeechSynthesisUtterance();
    
    let xCharacter;
    y = parseInt(y)+1;

      xCharacter = String.fromCharCode(97 + parseInt(x) ); // where x is 0, 1, 2 ...

      const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
        'data-name'
      );
      //console.log(selectedVoice);
      let languageScript ;

      languages.forEach(language => {
        if (selectedVoice.includes(language.language)) {
          //console.log(language.language);

          return languageScript = language;
          

        }  
      })

        languageScript === undefined 
        ? languageScript = languages[0] 
        : console.log("language is supported");

      //console.log(languageScript);
      
            voices.forEach(voice => {
        if (voice.name === selectedVoice) {
          msg.voice = voice;
         console.log(voice.name)

        }
        
      });

      
  
      // Set pitch and rate
      msg.rate = rate.value;
      msg.pitch = pitch.value;




    

    
    //console.log("hello speech synthesis")
    //console.log(xCharacter)
    //console.log(y)
    //console.log(languageScript);


 switch (instruction) {
    case "right": msg.text = xCharacter+y;
      break;
    case "left": msg.text = xCharacter+y;
      break;
    case "up": msg.text = xCharacter+y;
      break;
    case "down": msg.text = xCharacter+y;
      break;
    case "attacked": msg.text = languageScript.attack+xCharacter+y;
      break;
    case "opponentAttacked": languageScript.attacked+xCharacter+y;
      break;
    case "attackable": languageScript.attackable+xCharacter+y;
      break;
    case "white": msg.text = languageScript.whitetile+xCharacter+y;
      break;
    case "black": msg.text = languageScript.blacktile+xCharacter+y;
      break;
    case "victory": msg.text = languageScript.victory;
      break;
 // does not have a case for pass as of yet. This functionality is deprecated anyway
   //default: console.log("wtf happened here");
     break;
 }
 //console.log("speaking");
    window.speechSynthesis.speak(msg);
/* 
    if (instruction=== "right"){
      msg.text = xCharacter+y;
    }

    if (instruction=== "left"){
      msg.text = xCharacter+y;
    }

    if (instruction=== "up"){
      msg.text = xCharacter+y;
    }

    if (instruction=== "down"){
      msg.text = xCharacter+y;
    }

    if (instruction === "attacked"){
      msg.text = language.attack+xCharacter+y;
    }

    if (instruction === "opponentAttacked"){
      msg.text = language.attacked+xCharacter+y;
    }

    if (instruction === "attackable"){
      msg.text = xCharacter+y+language.attackable;
    }

    if (instruction === "white"){
      msg.text = language.whitetile+xCharacter+y;
    }

    if (instruction === "black"){
      msg.text = language.blacktile+xCharacter+y;
    }
    */

    


  }


  rate.addEventListener('change', 
  function() { 
    rateValue.textContent = rate.value;
    setCookie('voiceRate', rate.value, 3)
    //console.log(getCookieValue('voiceRate'))
  });

  pitch.addEventListener('change', 
  function() {
    pitchValue.textContent = pitch.value
    setCookie('voicePitch', pitch.value, 3)
  });

  voiceSelect.addEventListener('change',
  function() {
    //console.log(voiceSelect.value.split(' (', 1));
    // remove the lang before putting the value into cookie

    setCookie('voiceName', voiceSelect.value.split(' (', 1), 3);
    //console.log(getCookieValue('voiceName'))
    //console.log(decodeURIComponent(getCookieValue('voiceName')))
  })
  