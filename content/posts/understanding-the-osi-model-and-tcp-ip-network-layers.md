+++
date = '2025-06-24'
draft = false
title = 'Understanding the OSI model and TCP/IP network layers'
+++

The OSI model and TCP/IP underlie everything we do on the web, from visiting a site and watching a video to liking tweets or having your printer receive a document.

<!--more-->

## Introduction

First, we need to briefly understand what these two concepts are, as they are not the same. The OSI model is a standard that outlines how networking should occur. It consists of seven layers, which define the rules and methods for how a frame transforms into a packet and how a packet becomes information that your computer can understand. In contrast, the TCP/IP model takes a more focused approach, consisting of generally four to five layers derived from the OSI model.

![OSI and TCP representations](/images/OSI-vs-TCP-vs-Hybrid-2.webp)

As you can see, they are quite similar, with TCP incorporating OSI features. In the following sections, I will discuss all the layers, focusing more on those that are particularly useful for web applications in general.

## Physical

The layers are numbered bottom-up, so the Physical layer is the first. This is where electricity, light pulses, or both come into play. We won't discuss this layer much because it deals with more engineering-related issues, like wires and how electricity turns into bits. What you need to know is that this is where the physical elements live (as the name of the layer suggests).

## Data Link

Here we focus on network standards such as WiFi 802.11 and Ethernet 802.3. This layer acts as a medium for transmitting signals. One important component is the Media Access Control (MAC), which is represented by two hexadecimal characters separated by a colon, forming a total of six pairs of characters.

![MAC Address representation](/images/Untitled-2024-08-07-2121.png)

When examining a packet, we typically find a source MAC address that is sending the packet and a destination MAC address that is receiving it. You may wonder why we need MAC addresses when we already have IPv4 or IPv6 addresses. The answer is straightforward: IP operates at layer 3 of the OSI model, while MAC operates at layer 2. This division of responsibilities is important — MAC addresses identify "Who is this computer?" while IP addresses indicate "Where is this computer?" 

Additionally, IP addresses can change frequently; they may vary when you switch networks or reset your router, whereas MAC addresses remain constant. IP relies on network topology, while MAC addresses are tied to the hardware of the network adapter.

## Network

The Data Link Layer is responsible for transferring data between two nodes within the same network. In contrast, the Network Layer extends beyond this, enabling the sending and receiving of data between different networks. Here we will focus on key concepts such as the IP protocol, subnets, subnet masks, default gateways, and public and private addresses. We won't cover ICMP, VPN, or SSL/TLS at this time; those topics will be addressed in a future post.

### IP Protocol

The term "IP" typically refers to IPv4, which consists of four octets, each containing 8 bits (1 byte), for a total of 32 bits (4 bytes). IP addresses are crucial in modern web and network environments, as they help identify and locate devices within a network.

![IP representation](/images/IPv4-address-format.webp)

### Subnets

When a company has a specific IP address range, such as **192.168.1.0/24**, it includes addresses from **192.168.1.0** to **192.168.1.255**. The last part of the address, which varies, is referred to as the host address, while the rest is known as the network address. The "/24" notation indicates that there are 24 bits allocated for the network and 8 bits for the host. The addresses 0 and 255 in the host range are reserved for the network address and the broadcast address, respectively. All hosts within this range are subnets of the network.

### Subnet Mask

We discussed submasks in the previous topic, but let's explore them further. IP addresses can have a host portion that is larger than the network portion. Submasks are used to define the length of the address and specify the host part. This is indicated by the notation at the end, such as "/8", "/16", or "/24".

| Subnet Mask       | CIDR  | Hosts Available |
| ----------------- | ----- | --------------- |
| `255.0.0.0`       | `/8`  | 16,777,214      |
| `255.255.0.0`     | `/16` | 65,534          |
| `255.255.255.0`   | `/24` | 254             |
| `255.255.255.240` | `/28` | 14              |

Given the IP address **192.168.1.10** and a subnet mask of **255.255.255.0**, we know that the first 24 bits are designated for the network and the last 8 bits are allocated for hosts. This means our network address is **192.168.1.0**, and the broadcast address, which sends packets to all other hosts within the network, is **192.168.1.255**. The valid address range for hosts in this network is from **192.168.1.1** to **192.168.1.254**. 
