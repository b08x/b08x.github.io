---
layout: note
title: Creating a New PostgreSQL Database with Elevated Privileges
category: Development
tags:
  - pgsql
image: 
summary: 
date created: Saturday, November 2nd 2024, 12:40:08 pm
date modified: Tuesday, November 5th 2024, 3:11:04 am
---

## Quickly Add a Database

```sql
su - postgres 
psql -c 'create database test;'
psql -c 'grant all privileges on database test to postgres;'
```
