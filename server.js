
import { readFile, readFileSync, appendFile, writeFile } from "fs";
import express from "express";
import { createServer } from "http";
import socket from "socket.io";
const app = express();
const server = createServer(app);
const io = socket(server);
const activeUsers = new Set();
const message = new Set();

//Funkcja do generowania wartości prędkości wiatru
function randomNumber(low,high)
{
  return Math.floor(Math.random() * (high - low+1)+low);
};
//------------------------------------------------------


//Aktualizacja użytkowników po stronie serwera
io.on("connection", function (socket) {

  socket.on("new user", function (data) {
    console.log("Made socket connection");
    socket.userId = data;
    activeUsers.add(data);
    io.emit('server message', [...activeUsers]);
    console.log([...activeUsers]);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    activeUsers.delete(socket.userId);
    io.emit('server message', [...activeUsers]);
    console.log([...activeUsers]);
  }); 

});
//-----------------------------------------------------


//Generowanie wyników pomiarów, wysyłanie do klientów i zapis do archiwum.txt
setInterval(function() {
  readFile("./wczytaj.txt", function(text){
      var text = readFileSync("./wczytaj.txt").toString('utf-8');
      appendFile("./archiwum.txt",text+"\r\n",err=>{
       if(err===null){
           //Zapis do archiwum
       }
       else 
       {
           console.log("Error");
       }
      });

      //Jeżeli plik nie jest pusty wysyła wartość do użytkownika
      if(text.length!=0){
        message.add();
        io.emit('send message', text); 
      }
      
        //Pobieranie daty i godziny 
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        var curHour = today.getHours() > 12 ? today.getHours() - 12 : (today.getHours() < 10 ? "0" + today.getHours() : today.getHours());
        var curMinute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        var curSeconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
      
      
      //Wpisywanie wartości wygenerowanej do pliku wczytaj.txt
      writeFile("./wczytaj.txt",randomNumber(10,99)+" "+ "[km/h]"+" "+mm + '/' + dd + '/' + yyyy+"r. "+"godzina: "+curHour + ':' + curMinute + ':' + curSeconds ,err=>{
      
   });
  
  });
}, 5000); //Odstępy generowanych pomiarów to 5s

server.listen(8000, () => console.log("Server is running on port: 8000"));
