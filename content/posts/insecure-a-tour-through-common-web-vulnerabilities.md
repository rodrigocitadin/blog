+++
date = '2025-06-11'
draft = true
title = 'Insecure API: A tour through common web vulnerabilities'
+++

Security is often overlooked when building MVPs, but it's important to understand the risks — especially when they come from common, well-documented mistakes. In this post, we’ll walk through a minimal Go API riddled with vulnerabilities, showing the exact code that introduces each flaw and how an attacker might exploit it.

<!--more-->

## Briefing

All this post will show examples in Go using net/http package, examples are from this [repo](https://github.com/rodrigocitadin/insecure), if you never touched Go, dont worry, all this examples will be the most simple as possible, to ensure anyone can understand, some topics seems basic, but they occurs frequently (if not, they wont will be in OWASP common vulnerabilities)

## 1 - Insecure CORS Configuration

You probably have read about CORS, but you really know what is that? __Cross-Origin Resouce Sharing__ is just a way of protect your application of beeing accessed by other origins, preventing XSS (Cross-Site Scripting), if you configure your CORS wrong, things like that can happen:

```go
func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// CORS accepting all origins
		w.Header().Set("Access-Control-Allow-Origin", "*")
		next(w, r)
	}
}
```

### Why it's a problem:

Setting __Access-Control-Allow-Origin: *__ allows any website to make authenticated requests to your API. This is especially dangerous if your API uses cookies or other credentials.

### How it can be abused:

An attacker could host a malicious page that uses JavaScript to make requests to your API from the victim’s browser, potentially leaking sensitive data (CSRF-like attack)

## 2 - Weak Rate Limiting

Rate Limit is a way to control in which rate requests will be made to a network, if this is bad configured can lead to DoS attacks or things like that to overload a system

```go
var rateLimit = make(map[string]int)
var rateMutex sync.Mutex

func RateLimiter(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		rateMutex.Lock()
		rateLimit[ip]++
		count := rateLimit[ip]
		rateMutex.Unlock()

		if count > 10 {
			http.Error(w, "Too many requests", 429)
			return
		}
		next(w, r)
	}
}
```

### Why it's a problem:

The rate limiting key includes the source port (RemoteAddr), which changes on every request for NAT’d clients. That makes it ineffective for limiting by IP.

### How it can be abused:

An attacker could flood the API with requests without ever hitting the rate limit, bypassing the protection completely.

## Plaintext Credentials + Weak Auth

Using hashing and tokens to login should be default, but a lot of people doesn't use that (believe if you can)

```go
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var u models.User
	json.NewDecoder(r.Body).Decode(&u)
	row := db.QueryRow("SELECT id FROM users WHERE name = ? AND password = ?", u.Name, u.Password)
	var id int
	if err := row.Scan(&id); err != nil {
		http.Error(w, "invalid credentials", 401)
		return
	}
	w.Write([]byte("user-" + strconv.Itoa(id)))
}
```

### Why it's a problem:

Passwords are stored in plaintext and compared directly. There’s no hashing, no salting, and no session management.

### How it can be abused:

If the database is leaked (/dump endpoint — see below), all user credentials are immediately compromised, and attackers can bruteforce login attemps due to weak rate limiting (mentioned before). Some time ago new kind of vulnerabilities come to trendings, __timing attacks__, they are hard to do, but isn't impossible.
