package main

import (
	"fmt"

	"sync"

	"github.com/labstack/echo"
	mw "github.com/labstack/echo/middleware"
	"golang.org/x/net/websocket"
)

var connectionPool = struct {
	sync.RWMutex
	connections map[*websocket.Conn]struct{}
}{
	connections: make(map[*websocket.Conn]struct{}),
}

func main() {
	e := echo.New()

	e.Use(mw.Logger())
	e.Use(mw.Recover())

	e.Static("/", "public")
	e.WebSocket("/ws", func(c *echo.Context) (err error) {
		ws := c.Socket()

		connectionPool.Lock()
		connectionPool.connections[ws] = struct{}{}

		defer func(connection *websocket.Conn) {
			connectionPool.Lock()
			delete(connectionPool.connections, connection)
			connectionPool.Unlock()
		}(ws)

		connectionPool.Unlock()

		msg := ""

		for {
			if err = websocket.Message.Receive(ws, &msg); err != nil {
				return err
			}
			err = sendMessageToAllPool(msg)
			if err != nil {
				return err
			}
			fmt.Println(msg)
		}
		return err
	})

	e.Run(":1323")
}

func sendMessageToAllPool(message string) error {
	connectionPool.RLock()
	defer connectionPool.RUnlock()
	for connection := range connectionPool.connections {
		if err := websocket.Message.Send(connection, message); err != nil {
			return err
		}
	}
	return nil
}
