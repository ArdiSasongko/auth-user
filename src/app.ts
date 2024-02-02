import { Server } from "./server";
const PORT = process.env.PORT || 3000

const server = new Server().app

server.get('/', (req, res) => {
    res.status(200).send('Response Success')
})

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})