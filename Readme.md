#  TODO generator - www.angular.cz #

Toto je generátor nápověd k našim cvičením, a slouží výhradně pro nás. Pokud si jej prohlížíte, můžete se inspirovat ale je to zatím jednoúčelový nástroj, kde jsme na čistotu kódu moc nedbali.

*Pracujeme na tom abychom jej opensourcovali a uvolnili pro nekomerční použití co nejdřív, pokud máte o podobné řešení zájem, ozvěte se nám*

Každopádně použít jej bez našeho svolení zatím nesmíte.

## Technologie ##

Jade, Angualar, Bootstrap, Gulp, Npm

## Použití ##

Začlenění do projektu
``` 
npm install angular-cz-courseware --save-dev
```

v package.json nápovědu zbuildovat pomocí

```
courseware build
```

Zbuilduje todo do /index.html se všemi inline závislostmi.

## Ladění nápovědy ##

Můžete spustit vývojový server pomocí

```
courseware build
```

Vývojový server se spustí na http://localhost:8080 a sleduje změny všech todo.jade a také courseware-intro.jade

## Konfigurace ##

Konfigurace se načítá ze souboru *courseware.json*

Ukázka:

```
{
  "introFile": "courseware-intro.jade",
  "header": "Školení - Javascript - cvičení (www.angular.cz)",
  "todoFile": "todo.jade",
  "todoFilePath": "complete",
  "todos": [
    "01-basics",
    "02-object-data-types",
    "03-scope-and-closure",
    "04-oop",
    "05-exceptions",
    "06-this-and-async",
    "07-async-promise",
    "08-dom",
    "09-es6",
    "10-backbone",
    "11-ember",
    "12-angular",
    "13-react",
    "99-backbone-extra",
    "99-ember-extra",
    "99-angular-extra"
  ]
}

### Založení konfigurace ###

Projekt můžete initcializovat pomocí

```
courseware init
```

Vytvoří se courseware.json a courseware-intor.jade

### Další informace, které ještě poupravíme ###

### Struktura ###
Generátor bere seznam souborů ze seznamu todos, ve stejném pořadí zobrazí menu a hledá šablony v jednotlivých cvičeních podle zadaného nastavení složky.

### Direktivy ###

#### solution ####
Zobrazí skrývatelný box s řešením kódu, standardně je brán jako javascript a je skrytý. 
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


#### Zviditelnění celé nápovědy - hack ####
Obě direktivy mají zděděný scope a používají "visible" je možné je všechny rozbalit na stránce na jednou pomocí (ng-init="visible = true")


