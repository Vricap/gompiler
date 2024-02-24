package main

// Code below here!



func main() {
  ch := make(chan int)

    go func() {
        // This goroutine is supposed to receive a message.
        val := <-ch
        println(val)
    }()

    // The main goroutine also waits for a message on the channel.
    // Since no one sends a message to the channel, both goroutines are blocked,
    // leading to a deadlock.
    val := <-ch
    println(val)
}
        