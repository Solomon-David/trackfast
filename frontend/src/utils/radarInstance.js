import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";

Radar.initialize(import.meta.env.VITE_RADAR_KEY);

const getAddress = async (city, country) => {
    try{
        let address = await Radar.forwardGeocode({
    query: `${city}, ${country}`,
    limit: 1,
  });
        return address;
    }catch(error){
        console.log("Error getting sender address: ", error);
    }
}


const estimateDistance = async (data) =>{
    try {
    const { sender, receiver } = data;
        console.log("Sender: ", sender);
        console.log("Receiver: ", receiver);    
        const distance = await Radar.distance({
            origin: {
                latitude: sender?.addresses[0]?.latitude,
                longitude: sender?.addresses[0]?.longitude,
            },
            destination: {
                latitude: receiver?.addresses[0]?.latitude,
                longitude: receiver?.addresses[0]?.longitude,
            },
            modes: ["car"],
            units: "metric",
        });

        let distanceKm = Number(distance?.routes?.car?.distance?.value/1000) || 0;

        console.log("Distance in KM: ", distanceKm);
        return distanceKm;
} catch (error) {
  console.error("Error getting info: ", error);
}
}

export { getAddress, estimateDistance };