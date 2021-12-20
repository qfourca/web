package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var userA, userB int

func main() {
	http.Handle("/", http.FileServer(http.Dir("../src")))
	//http.Handle
	http.HandleFunc("/ws", socketHandler)
	port := "8000"
	log.Printf("Listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func socketHandler(writer http.ResponseWriter, request *http.Request) {
	conn, err := upgrader.Upgrade(writer, request, nil)
	defer conn.Close()

	//fmt.Println(conn.ReadMessage());
	if err != nil {
		log.Printf("upgrader.Upgrade: %v", err)
		return
	}

	for {
		messageType, p, err := conn.ReadMessage()
		fmt.Println(string(p))
		if err != nil {
			log.Printf("conn.ReadMessage: %v", err)
			return
		}
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Printf("conn.WriteMessage: %v", err)
			return
		}
	}
}
