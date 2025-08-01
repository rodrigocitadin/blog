+++
date = '2025-06-24'
draft = true
title = 'Understanding the OSI model and TCP/IP network layers'
+++

The OSI model and TCP/IP underlie everything we do on the web, from visiting a site and watching a video to liking tweets or having your printer receive a document.

## Introduction

First, we need to briefly understand what these two concepts are, as they are not the same. The OSI model is a standard that outlines how networking should occur. It consists of seven layers, which define the rules and methods for how a frame transforms into a packet and how a packet becomes information that your computer can understand. In contrast, the TCP/IP model takes a more focused approach, consisting of generally four to five layers derived from the OSI model.

![OSI and TCP representations](/images/OSI-vs-TCP-vs-Hybrid-2.webp)

As you can see, they are quite similar, with TCP incorporating OSI features. In the following sections, I will discuss all the layers, focusing more on those that are particularly useful for web applications in general.

## Headers, Encapsulation and Decapsulation

First, we need to know some kind of things that are essential to understand everything here. I think about putting this topic in the last, but when writing this, I noticed that a mentioned a lot of thigns without any explanation, like frames, packets and headers. So let's understand these things before all.

The entire OSI model works on adding and removing headers, think about requesting and index.html from some server by HTTPS, you data (request) will travel down the layers, from 7 to 1, and every layer will add their headers, like:

<!-- . **Application Layer:** HTTP request (GET /index.html) -->

<!-- . **Presentation Layer:** Encrypts it (TLS) -->

<!-- . **Transport Layer:** TCP headers, sequence numbers, ports -->

<!-- . **Network Layer:** IP addresses -->

<!-- . **Data Link Layer:** MAC addresses and frame checksum -->

<!-- . **Physical Layer:** Electrical/radio signals on the wire -->

<!-- *(We skipped layer 5 and you will understand that later)* -->

```
Application Data
   ↓
+--------------------------+  
| L7-L5 headers (optional) | ← Application/Presentation/Session
+--------------------------+
| L4 Header (TCP/UDP)      | ← Transport Layer (segment)
+--------------------------+
| L3 Header (IP)           | ← Network Layer (packet)
+--------------------------+
| L2 Header (MAC)          | ← Data Link Layer (frame)
| L2 Trailer (CRC)         |
+--------------------------+
| Bits on wire (0s and 1s) | ← Physical Layer
```

Your request will be some headers + data, the data in this scenario is your HTTP request in plain-text:

```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

So this will follow this structure:

```
+-------------------------+--------------------------+
| Layer 7 Headers (HTTP)  |  GET /index.html HTTP... |
+-------------------------+--------------------------+
```

And then sometime

```
+--------------------+-------------------------+
| IP Header (L3)     | TCP Segment / UDP Data |
+--------------------+-------------------------+
```

## Physical

The layers are numbered bottom-up, so the Physical layer is the first. This is where electricity, light pulses, or both come into play. We won't discuss this layer much because it deals with more engineering-related issues, like wires and how electricity turns into bits. What you need to know is that this is where the physical elements live (as the name of the layer suggests).

## Data Link

Here we focus on network standards such as WiFi 802.11 and Ethernet 802.3. This layer acts as a medium for transmitting signals. One important component is the Media Access Control (MAC), which is represented by two hexadecimal characters separated by a colon, forming a total of six pairs of characters.

![MAC Address representation](/images/Untitled-2024-08-07-2121.png)

When examining a packet, we typically find a source MAC address that is sending the packet and a destination MAC address that is receiving it. You may wonder why we need MAC addresses when we already have IPv4 or IPv6 addresses. The answer is straightforward: IP operates at layer 3 of the OSI model, while MAC operates at layer 2. This division of responsibilities is important — MAC addresses identify "Who is this computer?" while IP addresses indicate "Where is this computer?" 

Additionally, IP addresses can change frequently; they may vary when you switch networks or reset your router, whereas MAC addresses remain constant. IP relies on network topology, while MAC addresses are tied to the hardware of the network adapter.

## Network

The Data Link Layer is responsible for transferring data between two nodes within the same network. In contrast, the Network Layer extends beyond this, enabling the sending and receiving of data between different networks. Here we will focus on key concepts such as the IP protocol, subnets, subnet masks, default gateways, NAT, and public and private addresses. We won't cover ICMP, VPN, or SSL/TLS at this time; those topics will be addressed in a future post.

### IP Protocol

The term "IP" typically refers to IPv4, which consists of four octets, each containing 8 bits (1 byte), for a total of 32 bits (4 bytes). IP addresses are crucial in modern web and network environments, as they help identify and locate devices within a network.

![IP representation](/images/IPv4-address-format.webp)

### Subnets

When a company has a specific IP address range, such as **192.168.1.0/24**, it includes addresses from **192.168.1.0** to **192.168.1.255**. The last part of the address, which varies, is referred to as the host address, while the rest is known as the network address. The "/24" notation indicates that there are 24 bits allocated for the network and 8 bits for the host. The addresses 0 and 255 in the host range are reserved for the network address and the broadcast address, respectively. All hosts within this range are subnets of the network.

### Subnet Mask

We discussed submasks in the previous topic, but let's explore them further. IP addresses can have a host portion that is larger than the network portion. Submasks are used to define the length of the address and specify the host part. This is indicated by the notation at the end, such as "/8", "/16", or "/24".

| Subnet Mask       | CIDR  | Hosts Available |
| ----------------- | ----- | --------------- |
|  255.0.0.0        |  /8   |  16,777,214     |
|  255.255.0.0      |  /16  |  65,534         |
|  255.255.255.0    |  /24  |  254            |
|  255.255.255.240  |  /28  |  14             |

Given the IP address **192.168.1.10** and a subnet mask of **255.255.255.0**, we know that the first 24 bits are designated for the network and the last 8 bits are allocated for hosts. This means our network address is **192.168.1.0**, and the broadcast address, which sends packets to all other hosts within the network, is **192.168.1.255**. The valid address range for hosts in this network is from **192.168.1.1** to **192.168.1.254**. 

### Default Gateway

This is how packets are sent outside your network: through a default gateway, which is usually the first host in the network. In our previous example, this is **192.168.1.1**.

When you want to access something outside, such as Google's DNS server **8.8.8.8**, your computer first checks if **8.8.8.8** is within your Local Area Network (LAN). Since it's not, your computer will contact the default gateway (usually a router) to locate it externally. There may be several hops between routers before it successfully connects. 

To see how many hops your computer takes to reach the Google DNS server, you can use the `traceroute 8.8.8.8` command. This will also display your default gateway as the first hop.

You might be thinking, "Wait, your example IP is almost like my own IP" This is due to NAT and the differences between public and private IPs. Let's explore this in the next section.

### NAT, Public and Private IPs

Talking about routers, our default gateways, we often come to Network Address Translation. NAT is the reason you and I can share common IP addresses within our own networks. Specifically, it translates our public IP address — typically the router's IP — into private IP addresses used internally in our networks. Private and public IP addresses follow specific range rules. The table below outlines private IP ranges; any address outside of these ranges is considered a public IP, which means it can be accessed by others on the internet.

| Range                              | CIDR  |
| ---------------------------------- | ----- |
|  10.0.0.0  to  10.255.255.255      |  /8   |
|  172.16.0.0  to  172.31.255.255    |  /12  |
|  192.168.0.0  to  192.168.255.255  |  /16  |

You can check your IP address, and you will probably see something like **192.168.1.3** for your device, while your smartphone might have an IP address of **192.168.1.4**. However, when you request a website, the request will be sent from your public IP, such as **200.10.10.5**. Network Address Translation (NAT) translates private IP addresses to a public IP address and also handles port forwarding.

## Transport

While IP say to us where to delivery a packet, Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) will say how to delivery a packet, At this layer things become more end to end.

### UDP

This protocol is connectionless, which means we don't need to do anything other than send packets. We simply add the UDP header and send the data without waiting for confirmation of receipt or retransmission. If you're trying to deliver a message, this protocol might not be the best choice. However, if you want to stream a Netflix TV show, you’ve made the right choice. We cannot afford to pause and confirm if we received each packet while users are watching, as this would cause delays. Instead, we continuously send packets; if something is missing, the screen might blur a little, but life goes on.

![UDP Headers](/images/UDP-header.jpg)

The **Source Port** and the **Checksum** are optional fields. Regarding ports, the range is from 1 to 2^16 - 1 (which is 65535), but both 0 and 65535 are reserved. The first 1,000 ports are typically in use for default applications; for example, port 53 is commonly used for DNS.

### TCP

Unlike UDP, TCP is connection-oriented, using a three-way handshake and other mechanisms like sequence numbers to avoid losing packets. Let's take a look at how we establish a TCP connection between two hosts, specifically the three-way handshake.

#### Step 1: Client → Server (SYN)

| Field                     | Value                         |
| ------------------------- | ----------------------------- |
|   SYN flag                | 1 (set)                     |
|   ACK flag                | 0 (not set)                 |
|   Sequence Number         | 1000                        |
|   Acknowledgment Number   | — (ignored because ACK=0) |

>  “Hi server, I want to start a connection. My first byte will be #1000.”

#### Step 2: Server → Client (SYN + ACK)

| Field                     | Value             |
| ------------------------- | ----------------- |
|   SYN flag                | 1                 |
|   ACK flag                | 1                 |
|   Sequence Number         | 5000              |
|   Acknowledgment Number   | 1001 (C\_ISN + 1) |

> “Okay, I accept. My first byte will be #5000. I acknowledge your byte #1000 — I expect the next to be #1001.”

The `ACK=1` means “I’m responding to your SYN”, and ACK number = your ISN + 1.

#### Step 3: Client → Server (ACK)

| Field                 | Value             |
| --------------------- | ----------------- |
| SYN flag              | 0                 |
| ACK flag              | 1                 |
| Sequence Number       | 1001              |
| Acknowledgment Number | 5001 (S\_ISN + 1) |

> “Got your sequence #5000, so I expect #5001 next. Here’s my next byte #1001 — ready to send data!”

It's important to note that `SYN = 1` is only used in the first two steps of the connection establishment. Its purpose is to synchronize sequence numbers. After this initial phase, all packets will have `ACK = 1`. You might be wondering where all this information goes. This relates to the TCP headers. In the final section of this post, I will discuss encapsulation, which will help you understand these headers and their significance. For now, just remember: headers go with the data sent.

![TCP Headers](/images/tcp-header-format.jpeg)

TCP headers are longer than UDP headers. Each time TCP transmits data, the sequence number (SEQ) increases based on the size of the data sent. If the SEQ number does not correspond to the size of the data, it indicates that something has gone wrong, resulting in a retransmission to resend the lost packets.

## Session

This layer focuses on establishing, maintaining, and synchronizing communication between applications running on different hosts. It ensures that data is sent in the correct order and provides mechanisms for recovery in case of transmission failures. While we won't delve deeply into this layer, it’s important to understand concepts such as dialogue control, which includes full-duplex, half-duplex, and simplex communication modes.

- **Simplex:** Data travels just in one direction.                                   
- **Half-Duplex:** Data can travel in both directions, but only one direction at a time.
- **Full-Duplex:** Data can travel in both directions simultaneously.                    

HTTP/1.1 typically operates in Half-Duplex mode. This means that either the client or the server can send information, but only one at a time. In contrast, Full-Duplex communication can be seen in scenarios like video conferences or screen sharing on platforms like Discord.

## Presentation

When sending data, it is important to ensure that it is standardized. This involves processes such as data encoding, compression, and encryption. For example, consider the scenario of sending an image via email. First, the image needs to be saved in a common format, such as JPEG or PNG. When we attach the image to the email, it is typically transformed into MIME (Multipurpose Internet Mail Extensions) format, where the data is encoded as a binary file using 7-bit ASCII.

Emails were originally developed to transmit plain text only. To avoid the need for each email client to support every file type with specific extensions, the implementation of MIME became necessary. MIME allows us to send various types of data, such as PNG or JPEG images, seamlessly within emails without requiring individual modifications for each data type, this is why Presentation Layer is so valuable.

### TLS

I mentioned encryption in the previous section, and TLS (Transport Layer Security) helps us with that. Let's discuss the TLS handshake and its certificates.

```
Client                            Server
  | ---------- ClientHello --------> |
  | <--------- ServerHello --------- |
  | <------ Certificate + Key ------ |
  | --------- Key exchange --------> |
  | ----------- Finished ----------> |
  | <---------- Finished ----------- |
```

1. Client send a message with some informations: Supported TLS versions, Supported cipher suites, a random number (client random), domain name, extensions like ALPN (used for HTTP/2). The domain name is optional. 

2. Server responds with: Chosen TLS version and cipher suite, a random number (server random), It's digital certificate (X.509), and some other optional things like certificate chain status.

3. Depending on the cipher suite, the client generates a premaster secret, encrypts it with the server's public key, and sends it (RSA key exchange, older method), or they perform **Elliptic Curve Diffie-Hellman (ECDHE)** to derive a shared key without sending it (preferred modern method).

4. Finish exchanging messages, encrypted with the new session key. Each message includes a MAC addresses to verify handshake integrity.

The diagram above illustrates TLS 1.2. There are two main versions of TLS: 1.2 and 1.3. The key difference between them is that TLS 1.3 has a faster handshake process, requiring one less step. Additionally, TLS 1.3 exclusively supports ECDHE for key exchange, and the client’s final message is encrypted earlier in the process, which enhances privacy.

## Application

This is the final layer. When the user is at the door, let's take a look at some protocols of this layer.

| Protocol             | Purpose                                  |
| -------------------- | ---------------------------------------- |
|   HTTP/HTTPS         | Web browsing                             |
|   FTP/SFTP           | File transfer                            |
|   SMTP, IMAP, POP3   | Email                                    |
|   DNS                | Name resolution                          |
|   SNMP               | Network monitoring                       |
|   SSH                | Secure shell access                      |
|   Telnet             | Remote login (insecure)                  |
|   MQTT, AMQP         | Messaging protocols (IoT, microservices) |

In this post, we've discussed everything with one goal: to gain a better understanding of the web, which naturally includes HTTP and HTTPS (HTTP over TLS) and that will be our focus now.

### HTTP

Hypertext Transfer Protocol is the bases of web applications, a stateless and text-based protocol that allows a client (usually a browser) to request resources from a server. It defines how messages are formatted and transmitted, and how web servers and browsers should respond to various commands.

1. Client requests a index.html from example.com

```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

2. Servers responds with OK and the index.html

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1270

<html>...</html>
```

HTTP has some "verbs" that we call methods to retrieve or modify data, and a lot of response codes that we will no cover here.


| Method    | Purpose                          |
| --------- | -------------------------------- |
|  GET      | Retrieve data                    |
|  POST     | Send data to server              |
|  PUT      | Replace data                     |
|  PATCH    | Partially update data            |
|  DELETE   | Remove data                      |
|  OPTIONS  | Check what methods are supported |
|  HEAD     | Like GET, but without body       |
