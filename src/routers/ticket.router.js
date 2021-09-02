const express = require("express");
const router = express.Router();
const { insestTicket } = require("./../model/ticket/Ticket.model");

// Workflow
// create url endpoints
// Authorize every request with jwt
// Retrive all the ticket for the specific user
// Retrive a ticket from mongodb
// Update message conversation to the ticket database
// update ticket status // close , operator response pending,client response pending
// delete ticket from mongodb

router.all("/", (req, res, next) => {
  // res.json({message:"return form ticket router"});
  next();
});

// create url endpoints

router.post("/", async (req, res) => {
  try {
    // receive new ticket data
    const { subject, sender, message } = req.body;

    const ticketObj = {
      clientId: "6129d69ac1648a7aaa3feabd",
      subject,
      conversations: [
        {
          sender,
          message,
        },
      ],
    };

    console.log(req.body);

    // Insert in mongodb
    const result = await insestTicket(ticketObj);
    console.log(result)
    if (result._id) {
      return res.json({
        status: "success",
        message: "New ticket has been created",
      });
    }

    return res.json({
      status: "error",
      message: "Unablet to create the ticket,Please try again later",
    });
  } catch (error) {
    return res.json({
        status: "error",
        message: error.message,
      });
  }
});

module.exports = router;
