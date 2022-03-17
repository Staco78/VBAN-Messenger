# **Namespace Server**


# Events

### **message**
##### on('message',(msg: [Message](/docs/Classes/Message.md)) => {})
Emitted when a message is received.

Parameters
- msg: [Message](/docs/Classes/Message.md)
  - The message that was sent.
#

### **userConnected**
##### on('userConnected',(user: [User](/docs/Classes/User.md)) => {})
Emitted when a user is pinged.

Parameters
- user: [User](/docs/Classes/User.md)
  - The user who responded to the ping.
#

### **userDisconnected**
##### on('userDisconnected',(user: [User](/docs/Classes/User.md)) => {})
Emitted when a user doesn't respond to a ping.

Parameters
- user: [User](/docs/Classes/User.md)
  - The user who doesn't respond to the ping.
#

### **userStatusChanged**
##### on('userStatusChanged',(user: [User](/docs/Classes/User.md)) => {})
Emitted when a user change his status.

Parameters
- user: [User](/docs/Classes/User.md)
  - The user who changed his status.
#

### **friendRequestAccepted**
##### on('friendRequestAccepted',(user: [VBANMUser](/docs/Classes/VBANMUser.md)) => {})
Emitted when someone send a friend request.

Parameters
- user: [VBANMUser](/docs/Classes/VBANMUser.md)
  - The user who accepted the friend request.

#

### **friendRequestRecieved**
##### on('friendRequestRecieved',(user: [VBANMUser](/docs/Classes/VBANMUser.md)) => {})
Emitted when someone send a friend request.

Parameters
- user: [VBANMUser](/docs/Classes/VBANMUser.md)
  - The user who sent the friend request.

#

# Functions



### **getCurrentUser**
##### getCurrentUser(): [VBANMUser](/docs/Classes/VBANMUser.md) 
Return
- The object of the current user.

#

### **getFriends**
##### getFriends(): [User](/docs/Classes/User.md)[]

Return

- An array with all friends.

#

### **getRecentChannels**
##### getRecentChannels(page: number): [Channel](/docs/Classes/Channel.md)[]

Parameters

 - page: number
   - Page of the research. (50 results by page)

Return

   - Recent conversations with a paging system.
#

### **getUser**
##### getUser(id: string): [User](/docs/Classes/User.md)

Parameters

 - id: string
   - Identifier of the user.

Return

   - A user from his id.