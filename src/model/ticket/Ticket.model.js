const {TicketSchema}=require("./Ticket.schema");

const insestTicket=ticketObj=>{
    return new Promise((resolve,reject)=>{
        try {
            TicketSchema(ticketObj).save().then(data=>{
                resolve(data);
            }).catch(error=> reject(error));
            
        } catch (error) {
            reject(error);
        }

    })
}

const getTickets=clientId=>{

    return new Promise((resolve,reject)=>{
        try {
            TicketSchema.find({clientId}).then(data=>{
                resolve(data);
            }).catch(error=> reject(error));
            
        } catch (error) {
            reject(error);
        }

    })
}

const getTicketById=(_id,clientId)=>{

    return new Promise((resolve,reject)=>{
        try {
            TicketSchema.findOne({_id,clientId}).then(data=>{
                resolve(data);
            }).catch(error=> reject(error));
            
        } catch (error) {
            reject(error);
        }

    })
}

const updateClientReply=({_id,message,sender})=>{

    return new Promise((resolve,reject)=>{
        try {
            TicketSchema.findOneAndUpdate({_id},
                { status:'pending operator response',
            $push:{conversations:{message,sender} }},
                {new:true}).then(data=>{
                resolve(data);
            }).catch(error=> reject(error));
            
        } catch (error) {
            reject(error);
        }

    })
}

const updateStatusClose=({_id,clientId})=>{

    return new Promise((resolve,reject)=>{
        try {
            TicketSchema.findOneAndUpdate({_id,clientId},
                { status:'Closed'},
                {new:true}).then(data=>{
                resolve(data);
            }).catch(error=> reject(error));
        } catch (error) {
            reject(error);
        }

    })
}

const deleteTicket=({_id,clientId})=>{

    return new Promise((resolve,reject)=>{
        try {
            TicketSchema.findOneAndRemove({_id,clientId}).then(data=>{
                resolve(data);
            }).catch(error=> reject(error));
        } catch (error) {
            reject(error);
        }

    })

}

module.exports={
    insestTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    deleteTicket
}
