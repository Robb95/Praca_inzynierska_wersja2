import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import ReactDOM from 'react-dom';


const Page = styled.div`
  display: flex;
  width: 100%;
  background-image:  url('https://swiatlolux.pl/media/wysiwyg/zdj_cie_1_-_gdzie_postawi_elektrowni_.jpg');
  background-size: cover;
  background-position: center; 
  align-items: start;
`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 890px;
  max-height: 1000px;
  overflow: auto;
  width: 500px;
  border: 5px solid lightgray;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;



const Container1 = styled.div`
  display: flex;
  flex-direction: column;
  height: 250px;
  max-height: 500px;
  overflow: auto;
  width: 150px;
  border: 5px solid lightgray;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;


const Row = styled.div`
width: 100%;
margin-right: 5px;
text-align: center;
border-top-right-radius: 10%;
border-bottom-right-radius: 10%;
`;

const Row1 = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Message = styled.div`
  width: 100%;
  background-color: pink;
  color: #46516e;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;




//Program głowny po stronie klienta
const App = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

    useEffect(() => {
    socketRef.current = io.connect('/');

    //Generowanie nazwy użytkownika
    var name = "User" + Math.floor(Math.random()*(123123-1+1)+1);
    socketRef.current.emit("new user", name);

    socketRef.current.on('send message', data => {
        const messageObject = {
        body: data
      };
      receivedMessage(messageObject);

    });


    //Przesyłanie listy aktywnych użytkowników 
    socketRef.current.on('server message', message => {
      var element = <div>{message.map(user => {return <li>{user}</li>})}</div>;
      ReactDOM.render(element, document.getElementById('1'));

    });

    
    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    })

    
  }, []);

  
  //Funkcja do przekazywania wiadomości do okna użytkownika
  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }



  return (
    <Page>
      <Container1>
          <Row1></Row1>
          <Row>
            Aktywni użytkownicy: 
          </Row>
          <Row1></Row1>
          <Row>
            <div id="1"></div>
          </Row>
      </Container1>


      <Container>
        <Row>
          Wyniki pomiarów prędkości wiatru:
        </Row>
        <Row1></Row1>
        {messages.map((message, index) => {
            return (
              <Row1 key={index}>
              <Message>
                  {message.body}
              </Message>
              </Row1>
            )
        })}
      </Container>
      
    </Page>
  );

};

export default App;
