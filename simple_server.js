const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/schedule', (req, resp) => {
    console.log(req.query.timestamp)
    console.log(req.query.ad)
    let js_data
    if (req.query.ad === 'd') {
        fs.readFile('public/dep_jfk_2.json', 'utf8', (err, data) => {
            if (err)
                resp.send({ 'error': err.message })
            else {
                js_data = JSON.parse(data)
                max_ts = new Date(3600000)
                min_ts = new Date(1800000)
                let resp_data = []
                js_data.forEach(element => {
                    if (element.codeshared) {return}
                    if (!element["departure"].scheduledTime) {return}
                    let timestamp = Date.parse(element["departure"].scheduledTime)
                    
                    if (timestamp > req.query.timestamp) {
                        if(new Date(timestamp - req.query.timestamp) < max_ts){ // time difference is less than 2 hourse
                            //console.log(new Date(timestamp), new Date(parseInt(req.query.timestamp)), new Date(Math.abs(timestamp-req.query.timestamp)), max_ts, min_ts)
                            resp_data.push(element)
                        }
                    } else {
                        if(req.query.timestamp - timestamp < min_ts){
                            //console.log(new Date(timestamp), new Date(parseInt(req.query.timestamp)), new Date(Math.abs(timestamp-req.query.timestamp)))
                            resp_data.push(element)
                        }
                    }
                });
                console.log(resp_data.length)
                resp.send(resp_data)
            }
            
        })
    } else {
        fs.readFile('public/arr_jfk_2.json', 'utf8', (err, data) => {
            if (err)
                resp.send({ 'error': err.message })
            else {
                js_data = JSON.parse(data)
                max_ts = new Date(3600000)
                min_ts = new Date(1800000)
                let resp_data = []
                js_data.forEach(element => {
                    if (element.codeshared) {return}
                    if (!element["arrival"].scheduledTime) {return}
                    let timestamp = Date.parse(element["arrival"].scheduledTime)
                    
                    if (timestamp > req.query.timestamp) {
                        if(new Date(timestamp - req.query.timestamp) < max_ts){ // time difference is less than 2 hourse
                            //console.log(new Date(timestamp), new Date(parseInt(req.query.timestamp)), new Date(Math.abs(timestamp-req.query.timestamp)), max_ts, min_ts)
                            resp_data.push(element)
                        }
                    } else {
                        if(req.query.timestamp - timestamp < min_ts){
                            //console.log(new Date(timestamp), new Date(parseInt(req.query.timestamp)), new Date(Math.abs(timestamp-req.query.timestamp)))
                            resp_data.push(element)
                        }
                    }
                });
                console.log(resp_data.length)
                resp.send(resp_data)
            }
            
        })
    }
})

app.listen(port, () => { console.log(`${new Date()} : Listening on ${port}`) })
