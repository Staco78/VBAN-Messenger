# **Class Channel**

## Hierarchy

-   **Channel**
    -   [DMChannel](/docs/Classes/DMChannel.md)
    -   [GroupChannel](/docs/Classes/GroupChannel.md)

# Properties

### `Readonly` **id**

##### id: string

Id of the channel. (Wow ! The identifier !)

#

### `Readonly` **name**

##### name: string

Name of the channel. (- WHAT'S UR NAM BRO? - My nam iz Tom - OH ELLO TOM)

#

#### :warning: from v0.3

### `Readonly` **pinnedMessages**

##### pinnedMessages: [Message](/docs/Classes/Message.md)[]

Messages pinned in the channel. (U want a pin bro? I've a lot of pins in my pin box!)

#

# Methods

#### :warning: from v0.3

### **searchMessages**

##### searchMessages(query: string, page: number): [Message](/docs/Classes/Message.md)[]

Properties

-   query: string
    -   Search query of the message.
-   page: number
    -   Page index of the search.

Return

-   An array of messages founded from the query.

#

### **sendMessage**

##### sendMessage(content: string, attachement: string)

Properties

-   content: string
    -   Content of the message.
-   attachement: string
    -   (from v0.3) Attachement of the message.

Return

-   An array of messages founded from the query.

#
