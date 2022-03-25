# **Class Message**

## Hierarchy

-   **Message**
    -   [VBANCHATMessage](/docs/Classes/VBANCHATMessage.md)
    -   [VBANMMessage](/docs/Classes/VBANMMessage.md)

#

# Properties

### `Readonly` **author**

##### author: [User](/docs/Classes/User.md)

Author of the message. (WHO SENT THIS FKNG MESSAGE!? Oh! It's me! Ok.)

#

### `Readonly` **content**

##### content: string

Content of the message as markdown. (The content is what's inside, so the content of a message is just energy)

#

### `Readonly` **id**

##### id: string

Id of the message. (ID = Identic Directive)

#

#### :warning: from v0.4

### `Readonly` **mentions**

##### mentions: [User](/docs/Classes/User.md)[]

Who was mentionned in the message. (Mention is also called ping, so I will ping @everyone)

#

### `Readonly` **timestamp**

##### timestamp: Date

When the message was sent. (4AM!? Wtf bro! You send messages too late!)

#
# Methods

### **getChannel**

##### async getChannel(): [Channel](/docs/Classes/Channel.md)

Channel where the message whas sent. (OMG THIS MESSAGE WAS SENT IN THE DMS WITH MY GIRLFRIEND!!! I'm so happy <3)

#