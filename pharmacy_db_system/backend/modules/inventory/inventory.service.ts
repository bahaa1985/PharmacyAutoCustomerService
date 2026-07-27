import { PrismaClient } from "@prisma/client/extension";
import { prismaClient } from "../../utils/prisma-adapter";

export const getInventoryCountByPharmacyId= async(pharmacyId:bigint)=>{
    try{
        return await prismaClient.inventory.count({
            where:{
                pharmacy_id : pharmacyId
            }
        })
    }
    catch(error){
    console.error('Error fetching inventory count:', error);
    throw error;
    }
}