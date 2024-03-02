import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // when they are first time messaging each other, create a conversation between them
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId, 
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      }


      //   SOCKET IO FUNCTIONALITY TO BE ADDED HERE
      
      
    //   This will run in parallel  and not wait for the messages array to be updated
      await Promise.all([conversation.save(), newMessage.save()]);
      
    // this will take longer time 
    // await conversation.save();
    // await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
    try
    {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne(
            {
                participants: { $all: [senderId, userToChatId] },
          }).populate("messages"); //Not Reference but actual messages
      
      if (!conversation)
      {
        return res.status(200).json([]);
       }
        const messages = conversation.messages;
        res.status(200).json(messages);

    }
    catch (error)
    {
      console.log("Error in getMessages Controller ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
};
