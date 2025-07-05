+++
date = '2025-07-04'
draft = false
title = 'How your data travels the Internet'
# toc = true
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

Think of a DNS server as a large HashMap that maps domain names to their corresponding IP addresses.

| Domain name    | IP Address     |
|----------------|----------------|
| google.com     | 172.217.30.142 |
| cloudflare.com | 104.16.132.229 |
| ...            | ...            |

### HTTP Request

In order to display a webpage in your browser, you need to retrieve it from a server. When you visit **example.com**, the DNS lookup process identifies the server's IP address, allowing you to make an HTTP request. Specifically, this is a GET request, which has the following format:

1. Client (your browser) requests a /index.html from example.com

```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

2. Servers responds with OK and the /index.html

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1270

<html>...</html>
```

There are many HTTP methods and response codes. In this case, we have used the GET method, and the server responds with a status code of 200, which means "OK". Response codes are not included here, but you can refer to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) for more information.

| Method    | Purpose                          |
| --------- | -------------------------------- |
|  GET      | Retrieve data                    |
|  POST     | Send data to server              |
|  PUT      | Replace data                     |
|  PATCH    | Partially update data            |
|  DELETE   | Remove data                      |
|  OPTIONS  | Check what methods are supported |
|  HEAD     | Like GET, but without body       |

## Transport

We can't transmit our data over the internet in plain text. For example, if you log into Instagram and enter your password, someone could potentially intercept your data packets as they travel. To prevent this, we use TLS (Transport Layer Security), a protocol that encrypts our data before sending it and decrypts it upon arrival. TLS operates in the following way:

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

But where do all these keys come from? They originate from a certificate, which I won’t discuss in detail here. However, when you visit a website, you can find the server certificates in the URL bar. These certificates are issued by organizations that certify them. If you enter a website that is not certified, your browser will likely issue a warning about it.
