# KK1-webbdata-backend
Back-end för kunskapkontroll 1 i webbserver &amp; databaser 


<b>Starta servern med Node</b>

```
node server.js
```


<b>Hämta all data</b>
```
fetch(http://localhost:5000/todos/)
```


<b>Hämta specifik data</b>
```
fetch(http://localhost:5000/todos/:id)
(id genereras slumpmässigt vid skapandande av todo)
```


<b>Lägg till data</b>
```
fetch("http://localhost:5000/todos", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
  item: "text",
 }),
});
```


<b>Ändra data</b>
```
fetch("http://localhost:5000/todos/:id", {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
    id: "9999",
    item: "text",
    isComplete: true/false,
    }),
});
```


<b>Ändra del av data</b>
```
fetch("http://localhost:5000/todos/:id", {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
    item: "annan text"
    }),
});
```


<b>Ta bort data</b>
```
fetch("http://localhost:5000/todos/:id", {
 method: "DELETE"
});
```
