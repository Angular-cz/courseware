#  TODO generator - www.angular.cz #

Toto je generátor nápověd k našim cvičením, a slouží výhradně pro nás. Pokud si jej prohlížíte, můžete se inspirovat ale je to jednoúčelový nástroj, kde jsme na čistotu kódu moc nedbali.
Každopádně použít jej bez našeho svolení zatím nesmíte.

## Použití ##

``` 
npm start (gulp)
```

Spustí server na localhost:8283 se sledováním změn, livereloadem  a kompilací šablon. Výsledek je možno vidět na **localhost:8283/todo/**

```
npm run build (gulp build)
```

Zbuilduje todo do /index.html, kde bude dostupný pro účastníky.

### Struktura ###
Generátor bere seznam souborů z "todos.json" ve stejném pořadí zobrazí menu a hledá šablony v jednotlivých cvičeních podle zadaných názvů.

### Direktivy ###

#### solution ####
Zobrazí skrývatelný box s řešením kódu, standardně je brán jako javaskript a je skrytý. 
 - Pomocí "visible" je možné jej zobrazit. 
 - "html" změní typ na html.

```
solution.
solution(visible, html).
```

#### note ####
Zobrazí skrývatelný box s nápovědou, standardně je skrytý. 
 - Pomocí "visible" je možné jej zobrazit. 


```
note
note(visible)
```


#### Zviditelnění celé nápovědy ####
Obě direktivy mají zděděný scope a používají "visible" je možné je všechny rozbalit na stránce na jednou pomocí (ng-init="visible = true")


