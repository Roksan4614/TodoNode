class Queue{
    queue = []

    Enqueue = (_item) => this.queue.push(_item)
    Dequeue = () => { return this.queue.shift() }
    Length = () => { return this.queue.length }
    IsEmpty = () => {return this.Length() == 0 }
}

module.exports = Queue