//todo:
//1.read all the commands from the terminal x
//2.do something based on the commands (add, or read totos)
//3. store those data somewhere
//4. functions to read/write data

//import
// import chalk from "chalk"; //using es6
const fs = require('fs');
const chalk = require("chalk");
const yargs = require("yargs");
let currentid=0;

console.log(chalk.bold.blue("(✿ ♥‿♥)-------(ㅇㅅㅇ❀)-------♥(ˆ⌣ˆԅ)"));

function loadData(){
    const buffer=fs.readFileSync("database.json") //read the file (database) in our system
    const data = buffer.toString(); //return buffer (binary code for machine), then we convert it into string
    return JSON.parse(data); //parse string into js object
}

function saveData(todo){
    //read the existing data
    let data=loadData() // existing data, which is a js array of todos
    //make some changes
    data.push(todo)
    //save it
    fs.writeFileSync("database.json",JSON.stringify(data))
}

function addTodo(todoBody,todoStatus){
    let data=loadData();
    let datalength= Object.keys(data).length;
    console.log(datalength); 
    currentid=datalength+1
    saveData({id:currentid,todo:todoBody, status:todoStatus});
    console.log(`=*=task No.${chalk.bold.red(currentid)}:`, chalk.cyanBright(todoBody), chalk.redBright(`has just been added! ♥`) )

}

function deleteTodo(id){
    let data=loadData();
    let removedPosition=data.findIndex((item) => item.id === id);
    let todo = data[removedPosition].todo;
    data.splice(removedPosition, 1);
    // console.log("data after delete", data)
    fs.writeFileSync("database.json",JSON.stringify(data))
    console.log(`=*=task No.${chalk.bold.red(id)}:`, chalk.cyanBright(todo), chalk.redBright(`has just been removed! ♥`) )

}

function deleteAll(){   
    let data=loadData();
    data=[];
    fs.writeFileSync("database.json",JSON.stringify(data))
    console.log(chalk.redBright("everything is DELETED! DONE, DONE, AND DONE! Now go out and play!"))
}

function changeStatus(id){
    let data=loadData();
    let changePosition=data.findIndex((item) => item.id === id);
    data[changePosition].status = !data[changePosition].status 
    fs.writeFileSync("database.json",JSON.stringify(data))
}


// if(process.argv[2]=== "add")
// {addTodo(process.argv[3], process.argv[4]);}
// //add todo later
// else if(process.argv[2]==="list")
// {const todos = loadData();
// for(let{todo, status} of todos)
// {console.log(id, todo, status)}
// }
// //do something later


//YARGS //------------------------------------------------------------------------------------//


yargs.command({
    command: "add", 
    describe: "add some todo",
    builder:{
        todo:{
            describe:"content of our todo",
            demandOption:true, //is it required or not?
            type: "string",
        },
        status:{
            describe:"status of our todo",
            demandOption:false, //is it required or not?
            default:false,
            type:"boolean"
        },
    },
    handler: function({todo, status, id}){
       addTodo(todo, status);
    //    console.log(`=*=task No.${chalk.bold.red(id++)}:`, chalk.cyanBright(todo), `has just been added!`)
    }
})


yargs.command({
    command: "list", 
    describe: "add some todo",
    builder:{
        status:{
            describe:"todo status",
            type:"boolean",
            demandOption:false,
            default: "all"
        }
    },
    handler: function(args){
    const todos=loadData();
    console.log(chalk.black.bgCyan("HERE'S YOUR LIST:"))
    for(let{todo, status, id} of todos){
    if(args.status ==="all"){
    console.log(chalk.bgBlack(`=*=task No.${chalk.bold.red(id)}:`,chalk.cyanBright(todo, chalk.white("| Status: done?"), chalk.yellowBright(status))))

}
    else if(status===args.status)
    console.log(`=*=task No.${chalk.bold.red(id)}:`,chalk.cyan(todo), chalk.magentaBright(status))} 
}
})


yargs.command({
    command: "delete", 
    describe: "delete some todo",
    builder:{
        id:{
            describe:"id of our todo",
            demandOption:true, //is it required or not?
            type: "number",
            default: "all",
        }
    },
    handler: function({id}){
    deleteTodo(id);
    // console.log(`to-do ID ${id} was deleted`)
    }
})

yargs.command({
    command: "delete-all", 
    describe: "delete all todo",
    handler: function(){
deleteAll();
    }
})

yargs.command({
    command: "change", 
    describe: "change todo status",
    builder:{
        id:{
            describe:"id of our todo",
            demandOption:true, //is it required or not?
            type: "number",
        },
        status:{
            describe:"todo status",
            type:"boolean",
            demandOption:false,
        }
    },
    handler: function({id}){
        let data=loadData();
        let changePosition=data.findIndex((item) => item.id === id);
        changeStatus(id);
        console.log(`status of id ${id} now changed into "${!data[changePosition].status}"`)
    }
})



yargs.parse();


