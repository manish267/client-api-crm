const express = require("express");
const router = express.Router();
const { insestTicket,getTickets,getTicketById } = require("./../model/ticket/Ticket.model");
const {
  userAuthorization,
} = require("./../middlewares/authorization.middleware");

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


// create new ticket endpoints
router.post("/", userAuthorization, async (req, res) => {
  try {
    // receive new ticket data
    const { subject, sender, message } = req.body;

    const userId = req.userId;

    const ticketObj = {
      clientId: userId,
      subject,
      conversations: [
        {
          sender,
          message,
        },
      ],
    };

    // Insert in mongodb
    const result = await insestTicket(ticketObj);
    console.log(result);
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

// get all tickets for a specific user
router.get("/", userAuthorization, async (req, res) => {
    try {
      const userId = req.userId;
      // Insert in mongodb
      const result = await getTickets(userId);
      console.log(result);

      if (result.length) {
        return res.json({
          status: "success",
          result,
        });
      }    
    } catch (error) {
      return res.json({
        status: "error",
        message: error.message,
      });
    }
  });

//  get a specific ticket
router.get("/:_id", userAuthorization, async (req, res) => {
    try {
        const {_id}=req.params;
      const clientId = req.userId;
      // Insert in mongodb
      const result = await getTicketById(_id,clientId);
      console.log(result);

      if (result.length) {
        return res.json({
          status: "success",
          result,
        });
      }    
    } catch (error) {
      return res.json({
        status: "error",
        message: error.message,
      });
    }
  });


module.exports = router;
