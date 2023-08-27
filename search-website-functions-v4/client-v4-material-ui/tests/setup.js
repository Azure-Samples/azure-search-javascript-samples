let timeStamp=null;

// function to setup timestamp for complete run
export function getTestTimeStamp(){

    if(timeStamp===null){
        timeStamp = + new Date();
    }
    return timeStamp;
}