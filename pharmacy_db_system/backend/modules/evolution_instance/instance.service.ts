import axios from 'axios';
import {prismaClient} from '../../utils/prisma-adapter';
import { log } from 'node:console';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "default_api_key"
const EVOLUTION_URL = process.env.EVOLUTION_URL || "http://localhost:3000"

export const createEvolutionInstanceService = async (user_id:BigInt,instance_name: string,mobile:string) => {
    // console.log(instance_name);
    try {
        let obj = {
            instanceName: instance_name,
            qrcode: true,
            integration: "WHATSAPP-BAILEYS",
            number:mobile
        };
        // let data = JSON.parse(stringObj);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${EVOLUTION_URL}/instance/create`,
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            },
            data: obj
        };
        const response = await axios.request(config)
        
        await prismaClient.users.updateMany({
            where: { id:Number(user_id) },
            data: { instance_name: instance_name,instance_status: 'PENDING' }
        });

        return response.data
    }
    catch (error:any) {
        console.error("Evolution error data:", error.response?.data)
        console.error("Evolution error status:", error.response?.status)
        throw error
    }
}

export const getPairingCodeEvolutionService = async (instance_name: string) => {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${EVOLUTION_URL}/instance/connect/${instance_name}`,
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            }
        };
        const response = await axios.request(config)
        console.log("data",response.data);
        
        return response.data
    }
    catch (error) {
        console.error("Error connecting user evolution instance:", error)
        throw error
    }
}


export const setWebhookEvolutionService = async (instance_name: string) => {
    try {
        console.log("backend url",process.env.BACKEND_URL);
        const WEBHOOK_URL = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/evolution/webhook` : "http://localhost:3000/evolution/webhook"
        let data = {
            webhook: {
                enabled: true,
                url: WEBHOOK_URL,
                byEvents: false,
                base64: false,
                events: [
                    "CONNECTION_UPDATE",
                    "MESSAGES_UPSERT",
                    "SEND_MESSAGE"
                ]
            }
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.EVOLUTION_URL}/webhook/set/${instance_name}`,
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            },
            data: data
        };

        const response = await axios.request(config)
        return response.data
    }
    catch (error:any) {
        console.error("Error setting webhook for evolution instance:", JSON.stringify(error.response?.data,null,2))
        throw error
    }
}

export const getConnectionStateService = async(instance_name:string)=>{
    try{
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${EVOLUTION_URL}/instance/connectionState/${instance_name}`,
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            }
        };
        const response = await axios.request(config)
        if(response.data && response.data.instance.state){
            updateEvolutionInstanceStatusService(instance_name,response.data.instance.state)
        }
        // return response.data.instance.state
    }
    catch(error){
        console.error("Error getting connection state for evolution instance:", error)
        throw error
    }
}
export const updateEvolutionInstanceStatusService = async (instance_name: string, status: string) => {

    try {
        const updatedUser = await prismaClient.users.updateMany({
            where: { instance_name: instance_name },
            data: { instance_status: status }
        });
        return updatedUser
    }
    catch (error) {
        console.error("Error updating user evolution instance status:", error)
        throw error
    }
}