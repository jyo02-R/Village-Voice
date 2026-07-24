const mongoose = require('mongoose');
const dns = require('dns');

// Set DNS to Google's Public DNS to bypass local loopback resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoUri = "mongodb+srv://rjyothsna2007_db_user:VillageVoice123@villagevoice.2yzdqut.mongodb.net/villagevoice?retryWrites=true&w=majority&appName=VillageVoice";

const sarpanchSchema = new mongoose.Schema({
    name: String,
    username: String,
    village: String
});

const Sarpanch = mongoose.model('Sarpanch', sarpanchSchema);

async function checkSarpanches() {
    try {
        console.log('Connecting to cloud MongoDB Atlas (DNS patched)...');
        await mongoose.connect(mongoUri);
        console.log('Connected! Fetching Sarpanch accounts...');
        
        const list = await Sarpanch.find({});
        console.log(`Found ${list.length} Sarpanch accounts in the cloud database:`);
        list.forEach(s => {
            console.log(`- Username: ${s.username}, Village: ${s.village}`);
        });
        
        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (err) {
        console.error('Error:', err);
    }
}

checkSarpanches();
