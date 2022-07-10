

const result = document.querySelector(".result");
const gen = document.querySelector("#generated");
const info = document.querySelector("#info");
const compile = document.querySelector("#compile");
const keyWords = /^(Template|Line|yellow|blue|red|green|black|white)$/g;
let a = 0, j = 0, x1, x2, y1, y2, exit = false;
 
let sampleCode = `Template 458, 198
                  Line 85, 37, 76, 172
                  Line 88, 98, 173, 89
                  Line 181, 38, 157, 178
                  Line 212, 49, 203, 168
                  Line 216, 37, 291, 40
                  Line 207, 93, 281, 100
                  Line 190, 162, 270, 153
                  Line 308, 26, 291, 169
                  Line 354, 22, 334, 179
                  Line 372, 66, 437, 70
                  Line 437, 80, 430, 143
                  Line 430, 143, 375, 135
                  Line 375, 131, 378, 60`; 

 
compile.addEventListener("click", (e)=>{

  e.preventDefault();

    if(info.value.trim() == 0){
      alert("Empty input");
    }else{
      exit = false;
      //Lexical analyzer checker
      const res = lexicalAnalyzer(info.value)
    
      //Missing keywords, Template must always be in
     if(res.filter(item =>{return item.value.match(/^(Template)$/)}).length === 0){
        result.innerHTML = `Unable to trace a line without a template.`;
        exit = true;
        return;
     }

      //Supported keywords
      newRes = res.filter((item) => {return isNaN(item.value)})
      while(newRes.length > 0){
        item = newRes.shift();
        if(!item.value.match(keyWords)){
          result.innerHTML = `\"${item.value}\" is not a supported keyword.`;
          exit = true;
          return;
      }
      }


      //Assuring the max width and height of canvas
      console.log(res[1].value, res[2].value)
      if(res[1].value > 550 || res[2].value > 246){
        result.innerHTML = `The maximum dimensions for the canvas are 550 x 246 but received ${res[1].value} x ${res[2].value}`;
        exit = true;
        return;
      }
      //Lexical analyzer checker


      result.innerHTML = "";
      gen.innerHTML = codeGenerator(syntaxAnalyzer(lexicalAnalyzer(info.value)));
    }


});


function lexicalAnalyzer (code) {
  return code.replaceAll(",", " ").split(/\s+/)
          .filter(function (t) { return t.length > 0 })
          .map(function (t) {
            return isNaN(t)
                    ? {type: "Keyword", value: t}
                    : {type: "Number", value: t}
          })
}

function syntaxAnalyzer (tokens) {
    let arg;
    let syntaxTree = {
      type: "Line tracing",
      expression: [],
      command: []
    }

    //Loop Lexical analyzer tokens
    while (tokens.length > 0){
      let currentToken = tokens.shift(); //Shift removes the first item and returns removed
  
        //Look for keywords
    if (currentToken.type === "Keyword") {
        switch (currentToken.value) {

            /***************************************************************************/
          case "Template":
                    let expression = {
                    type: "expression",
                    name: "Template",
                    arguments: []
                    }
                    
            const templateArray = ["width", "height", "color"];
            for (let i = 0; i < 3; i++) {

                //Validates next line to be a Line command and if it i = 4 means there was no specified color to which "Black" was assigned as default
                if( (i == 2 && tokens[0] === undefined) || (i == 2 && tokens[0]["value"] === "Line")){
                  arg = {type: "Keyword", value: "white"};
                }else{
                  arg = tokens.shift(); // Loop through token
                }

                 //Too many numeric arguments
                 if(i === 2 && arg.type === "Number"){
                  result.innerHTML = `Too many arguments, expected int, int, string near \"${arg.value}\"`;
                  exit = true;
                  return;
                }
                //Too many keywords | Too many keywords in between args
                if(i < 2 && arg.type === "Keyword"){
                  result.innerHTML = `Incorrect list of arguments, expected int, int, string near \"${arg.value}\"`;
                  exit = true;
                  return;
                  }
                    if(tokens[0] !== undefined)
                  if(i === 2 && tokens[0].value !== "Line" ){
                    result.innerHTML = `Too many keywords,  expected int, int, string near \"${arg.value}\"`;
                    exit = true;
                    return;
                  }

                  if(arg === undefined){
                    result.innerHTML = "Incorrect list of arguments in Template width (float), height (float), (optional) color (string))";
                      return;
                  }

                if(arg.type === "Number" || i === 2 ) {
 
                    //Template arguments: Width, Height, #Color
                            expression.arguments.push({  // add argument information to expression object
                            type: templateArray[i],
                            value: arg
                        });



                } else {
                  result.innerHTML = "Incorrect list of arguments in Template width (float), height (float), (optional) color (string))";
                    return;
                }
            } 
                syntaxTree.expression.push(expression)    // Add expression to the syntax tree
                break;
            /***************************************************************************/

            case "Line":
                
                    let command = {
                        type: "command",
                        name: "Line",
                        arguments: []
                        }
                        
                const lineArray = ["startX", "startY", "endX", "endY", "color"];

                for (let i = 0; i < 5; i++) {

                  //Validates next line to be a Line command and if it i = 4 means there was no specified color to which "Black" was assigned as default

                  if( (i == 4 && tokens[0] === undefined) || (i == 4 && tokens[0]["value"] === "Line")){
                    arg = {type: "Keyword", value: "black"};
                  }else{
                     arg = tokens.shift(); // Loop through token
                  }

                    //Too many numeric arguments
                    if(i === 4 && arg.type === "Number"){
                      result.innerHTML = `Too many arguments, expected int, int, int, int, string near \"${arg.value}\"`;
                      exit = true;
                      return;
                    }

                   //Too many keywords | Too many keywords in between args
                    if(i < 4 && arg.type === "Keyword"){
                      result.innerHTML = `Incorrect list of arguments, expected int, int, int, int, string near \"${arg.value}\"`;
                      exit = true;
                      return;
                      }

                      if(tokens[0] !== undefined)
                    if(i === 4 && tokens[0].value !== "Line"){

                        result.innerHTML = `Too many keywords, expected int, int, int, int, string near \"${arg.value}\"`;
                        exit = true;
                        return;

                      }
                      
                  if(arg === undefined){
                    result.innerHTML = "Incorrect list of arguments Line startX (int), startY (int), endX (int), endY (int), (optional) color (string)";
                          return;
                    }
                    if(i === 4 || arg.type === "Number" ) {
                      
                            //Line startX, startY, endX, endY, color 
                                command.arguments.push({  // add argument information to expression object
                                type: lineArray[i],
                                value: arg
                            });
                    } else {
                      result.innerHTML = "Incorrect list of arguments Line startX (int), startY (int), endX (int), endY (int), (optional) color (string)";
                        return;
                    }
                } 
                    syntaxTree.command.push(command)    // Add command to the syntax tree
                
                break;
        }

    }

      }
        return syntaxTree
}


function codeGenerator (syntaxTree) {

  if(exit == true){
    return;
  }
  let generatedCode = "";
  //Create canvas out of the expression object
    const template = document.createElement("canvas");
          template.id = "canvas";
          template.width = syntaxTree.expression[0]["arguments"][0].value.value;
          template.height = syntaxTree.expression[0]["arguments"][1].value.value;
          template.style.backgroundColor = syntaxTree.expression[0]["arguments"][2].value.value;

        generatedCode += template.outerHTML + "\n";
        result.appendChild(template);
  //Draw lines out of the command object

          let canvas = document.querySelector("#canvas");
          let canvasContext = canvas.getContext("2d");

          generatedCode += `
              let canvas = document.querySelector("#canvas");
              let canvasContext = canvas.getContext("2d");\n`;

          while(syntaxTree.command.length > 0){

            let command = syntaxTree.command.shift();
                command = command["arguments"];
                
                if(command[4].value === undefined) //Validating for missing color parameter
                    command[4]["value"] = {type: "color", value: "black"};

            let startX = command[0].value.value;
            let endX = command[1].value.value;
            let startY = command[2].value.value;
            let endY = command[3].value.value;
            let color = command[4].value.value;
  
            canvasContext.beginPath();
            canvasContext.moveTo(startX, endX);
            canvasContext.lineTo(startY, endY);
            canvasContext.strokeStyle = color;
            canvasContext.stroke();

            generatedCode += `
              canvasContext.beginPath();
              canvasContext.moveTo(${startX}, ${endX});
              canvasContext.lineTo(${startY}, ${endY});
              canvasContext.strokeStyle = "${color}";
              canvasContext.stroke(); \n`;

            }
   
   return generatedCode;
  }


//Determining coordinates to draw on
const coordsContainer = document.querySelector(".coords");
const marker = document.querySelector(".marker");
document.body.addEventListener("click", (e)=>{

    e.preventDefault();
    if(e.target.id === "canvas"){
      let rect = e.target.getBoundingClientRect();
      let x = Math.floor(e.clientX - rect.left), y = Math.floor(e.clientY - rect.top);
      coordsContainer.innerHTML = `X: ${x}, Y: ${y}`;

      if(a == 0){
        x1 = x;
        y1 = y;
        a++;
        return;
      }

      if(a == 1){
        x2 = x;
        y2 = y;
        a++;
        info.value += `\nLine ${x1}, ${y1}, ${x2}, ${y2}`;
        a = 0;
      }

    }



    if(e.target.id === "res"){

        let rect = e.target.getBoundingClientRect();
        let x = Math.floor(e.clientX - rect.left), y = Math.floor(e.clientY - rect.top);
        coordsContainer.innerHTML = `X: ${x}, Y: ${y}`;

        /************************************ */
        let dot = document.createElement("div");

        dot.classList.add("dot");
        dot.style.left = (x+11)+"px";
        dot.style.top = (y+53)+"px";
        result.appendChild(dot);

        setTimeout(() => {
          result.removeChild(dot);
        }, 100);
        /************************************ */
        //getX ANCHO
        if(a == 0){
          x1 = x;
          a++;
          return;
        }
        //getX
        if(a == 1){
          x2 = x;
          a++;
          return;
        }
        //getY LARGO
        if(j == 0){
          y1 = y;
          j++;
          return;
        }

        if(j == 1){
          y2 = y;
        }

          realX = x1-x2;
          realY = y1-y2;

          if(realX < 0)
              realX *= -1;

          if(realY < 0)
              realY *= -1;

          info.value = `\nTemplate ${realX}, ${realY}`;
          a = 0;
          j = 0;

    }
  });
  