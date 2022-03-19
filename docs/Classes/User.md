# **Class User**


## Hierarchy
- **User**
  - [VBANCHATUser](/docs/Classes/VBANCHATUser.md)
  - [VBANMUser](/docs/Classes/VBANMUser.md)

#
# Properties


### `Readonly` **address**
##### address: string
Address of the user. (Spoiler : It's an IP Address)

#

### `Readonly` **color**
##### color
Color of the user. (IDK what is the type, help me please, I'm alone on this documentation, the other guy don't want to help me - Piripe)

#

### `Readonly` **commentary**
##### commentary: string
Commentary of the user. (Bruh it's too simple to explain)

#

### `Readonly` **id**
##### id: bigint
Id of the user. (LOULILOL I'VE YOU ID BRO)

#

### `Readonly` **port**
##### port: number
Port of the user. (French joke : It's not a pig)

#

### `Readonly` **status**
##### status: [UserStatus](/docs/Enums/UserStatus.md)
Status of the user. (It could be invisible (no))

#

### `Readonly` **username**
##### username: string
Username of the user. (You don't need more explanations)

#

# Methods

#### :warning: from v0.4
### **addToGroup**
##### addToGroup(groupId: string)
Add the user to a group (Because he's kind :smiley:)

Properties
- groupId: string
  - Id of the group channel.


#

### **blockUser**
##### blockUser()
Block the user (Because he's not kind 🤬)

#

### **getDMChannel**
##### getDMChannel(): [DMChannel](/docs/Classes/DMChannel.md)

Return

   - The DM channel with this user.
#
