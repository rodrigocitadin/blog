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

Here we focus on network standards such as WiFi 802.11 and Ethernet 802.3. This layer acts as a medium for transmitting signals and includes protocols that define how our packets or frames are processed by the connected devices that share these layers. One important component is the Media Access Control (MAC), which is represented by two hexadecimal characters separated by a colon, forming a total of six pairs of characters.

![MAC Address representation](/images/Untitled-2024-08-07-2121.png)

When we look at a packet, will probably have a source MAC Address sending the packet, and a destination MAC Address receiving the packet
