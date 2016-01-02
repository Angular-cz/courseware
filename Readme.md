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

Pokud nechcete buildovat nápovědu spolus Vašim projektem, můžete využít rovnou zbuildovaný index.html, který obsahuje vše potřebné.

## Ladění nápovědy ##

Můžete spustit vývojový server pomocí

```
courseware devel
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
  ],
  "testsSocketUrl" : "http://localhost:8000"

}

### Založení konfigurace ###

Projekt můžete initcializovat pomocí

```
courseware init
```

Vytvoří se courseware.json a courseware-intor.jade

### Spouštění testů ###
Courseware má podporu spouštění testů a aktualizace gui přes sockety.

Aby toto fungovalo, je třeba udělat několik kroků

#### Test runner

Přidat do test runneru spec-json-reporter a výstupy nasměrovat do složky

Příklad pro karma.

```
  config.plugins.push('karma-spec-json-reporter');

  config.reporters.push('specjson');

  var outPath = path.join(processDir, "test-results/", exerciseDir + '.json');

  config.specjsonReporter = {
    outputFile: outPath
  };
```

#### Socket server ####
Aktivovat socket server, připojením na existující server a specifikovat složku s výsledky souborů

Ukázka z gulpfile
```
  var app = connect();
  app.use(serveStatic('./'));
  var server = app.listen(config.httpServer.port);

  ...

  var courseware = require('angular-cz-courseware');
  courseware.socketServer(server, 'test-results');
});
```

#### Konfigurace
V courseware.json přidat informaci, kde běží server.

```
  "testsSocketUrl" : "http://localhost:8000"
```

#### V todo popisech

Použít v todo popisech direktivu pro zobrazení testů

```
tests(todo="3.3")
```

V popisu testů v it / describe se pak musí objevit výraz (TODO 3.3)

#### Použití

Po startu http-serveru bude aplikace komunikovat se socket serverem a reagovat na změny, poté pusťte karma-runner pro příslušný příklad.

Před startem je ještě nutno mít vytvořeny soubory s výsledky aby fungoval dobře watch. 

### Struktura ###
Generátor bere seznam souborů ze seznamu todos, ve stejném pořadí zobrazí menu a hledá šablony v jednotlivých cvičeních podle zadaného nastavení složky.

### Jade ###

Pro escapování html se používá **:ecape** a pro escapování expression, které by neměl zpracovat angular **:escape-ng**
### Direktivy ###

#### solution ####
Zobrazí skrývatelný box s řešením kódu, standardně je brán jako javascript a je skrytý. 
 - Pomocí "visible" je možné jej zobrazit. 
 - "html" změní typ na html.

```
solution.
solution(visible, html).
```

zdrojový kód je také možné zapsat pomocí

```
pre
  code.
    your code... {}
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


