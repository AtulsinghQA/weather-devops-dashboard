const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const app = express();

app.use(cors()); // Critical for browser security!

app.get('/metrics', async (req, res) => {
    try {
        // Gathering the 4 Golden Signals
        const load = await si.currentLoad();
        const mem = await si.mem();
        const temp = await si.cpuTemperature();
        const disk = await si.fsSize();

        res.json({
            cpu: Math.round(load.currentLoad),
            ram: Math.round((mem.active / mem.total) * 100),
            temp: Math.round(temp.main) || 35, // Defaulting if sensor is asleep
            disk: Math.round(disk[0].use)
        });
    } catch (e) {
        res.status(500).json({ error: "Agent Error" });
    }
});

app.listen(3000, () => console.log('M1 Agent is LIVE on http://localhost:3000'));