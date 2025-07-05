+++
date = '2025-07-04'
draft = false
title = 'How your data travels the Internet'
+++

Let's imagine you're surfing the internet and you discover an interesting new website called **example.com**. You click on it, and some text appears on your screen. Everything seems to be working perfectly, but do you know how this happened? How does your computer retrieve that information to display it on your screen so quickly? Let's explore this entire process.

You have probably heard of concepts like the OSI and TCP/IP models, along with this diagram:

![TCP/IP Diagram](/images/how-your-data-travels-the-internet/tcp-ip-diagram.png)

The modern networks are based on the TCP/IP model, but how do these layers function?

## Encapsulation and Headers

Before examining the layers themselves, we must understand encapsulation, decapsulation (the reverse order of encapsulation), and headers, as these concepts are fundamental to how you visualize the layers operating on data.

In the first example, we are requesting the **/index.html** file from **example.com**.

```
HTTP GET /index.html
└── TLS Record (Encrypted HTTP Request)
    └── TCP Segment
        └── IP Packet
            └── Ethernet Frame
                └── Bits on the Wire (01010110...)
```

Each layer has its own terminology for the data, such as segments, packets, and frames. We use these terms to identify our position within the model without explicitly stating which layer we are in. For example, when we refer to an **Ethernet Frame**, we can infer that we are operating at layer 1. Computers typically do not indicate their current layer directly; instead, they use these names to help us understand where we are in the model.

In encapsulation, each layer adds headers to the data, and some even modify its structure.

![Encapsulation in practice](/images/how-your-data-travels-the-internet/encapsulation.jpeg)

As you can imagine, when another computer reads that entire thing, it will start from the bottom, removing the headers and translating the data.

Another layer that we will not discuss here is the **Physical** layer, which handles the wires and bits. However, I will include this layer in the tables and diagrams as I did previously with "Bits on the Wire." This serves as a good example of why we use standardized nomenclature instead of layer indices. The TCP/IP model can have either 4 or 5 layers, while the OSI model has 7 layers, yet both utilize the same protocols and names.

## Application

As mentioned earlier, when you enter **example.com** in your browser, it makes an HTTPS request (HTTP over TLS) to the IP address of **example.com**, which we'll use as an example: **172.217.30.142**. But how does the URL resolve to an IP address? This process is handled by a DNS server. Here’s how it works:

### DNS Server

You can't send information using just domain names; you need IP addresses. To obtain an IP address, your computer first checks if it is already stored in the cache (browser, ISP, or operating system). If it is, great! We can proceed with our HTTP request. If not, we need to follow some steps (reduced to just one because DNS is not our focus here) before everything can move forward.

Your computer will send a UDP packet to a DNS server. Your router or ISP typically provides the address, but you can also use a different DNS server, such as Google's DNS server (IP address 8.8.8.8). The server will then respond with the correct IP address for the requested domain name.

But think DNS Server as a giant HashMap, who maps domain names to IPs:

| Domain name    | IP Address     |
|----------------|----------------|
| google.com     | 172.217.30.142 |
| cloudflare.com | 104.16.132.229 |
| ...            | ...            |
