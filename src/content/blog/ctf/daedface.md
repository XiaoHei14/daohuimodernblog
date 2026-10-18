---
title: 'DEADFACE CTF Writeup'
description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
author:
  - 'DaoHui'
pubDate: 'Oct 09 2026'
heroImage: 'https://i.pinimg.com/736x/9f/25/8d/9f258d252923f4b933f5e0b23b477191.jpg'
tags: ['CTF', 'Pwn','Blue Team']
draft: true
---

# Hail Caesar

Submit the flag with the dog's name as: deadface{dog's name}

![題目](assets/pass_hint.png)

Look sticky note on write `Zl qbt'f anzr vf Srgpu` Like ROT13 so i use so script to decode this crpyto

```python
import codecs

code = "Zl qbt'f anzr vf Srgpu"
decoded = codecs.decode(code, 'rot_13')

print(decoded)
```

```
My dog's name is Fetch
```
So Flag is  `deadface{Fetch}`

# Infrequent Emojis
Question 

https://doomscroll.dctf.io/post/252

# Admitted Under Another Name
